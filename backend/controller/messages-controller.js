import { response } from "../utils/response.js"

import * as MessageModel from '../model/message-model.js'
import * as MessageSchema from '../schema/message-schema.js'
import * as redisHelper from '../utils/redis-helper.js'
import { publicId } from '../schema/user-schema.js'
import { logging } from "../utils/logger.js"
import { validate } from "../utils/validate.js"
import { incrbyRateLimit } from "../middleware/rate-limiting.js"

const messagesController = {}



const responses = {
    serverError: (res)=>{return response(res, false, 500, "server error")},
    invalidFormat: (res, message)=>{return response(res, false, 400, message)},
    invalidToken: (res)=>{return response(res, false, 403, "invalid token")},
    userNotFound: (res)=>{return response(res, false, 400, "user not found")},

    getMyMessages: {
        success: (res, messages)=>{return response(res, true, 200, "successfully retrieved your messages", messages)}
    },
    create: {
        success: (res)=>{return response(res, true, 201, "message sent")}
    },
    changeProperties: {
        success: (res, message)=>{return response(res, true, 200, "patch success", message)}
    },
    delete: {
        success: (res, message)=>{return response(res, true, 200, "delete success", message)}
    }
}

messagesController.create = async (req, res) => {
    logging('/messages/send/:publicId')

    const {ok, message, value: publicIdInput} = validate(publicId, req.params.publicId)
    if(!ok){return responses.invalidFormat(res, message)}
    const {ok: ok2, message: message2, value: body} = validate(MessageSchema.create, req.body)
    if(!ok2){return responses.invalidFormat(res, message2)}

    try {
        const userId = await MessageModel.create({ publicId: publicIdInput, ...body })
        await redisHelper.delPattern('messages', userId)

        await incrbyRateLimit('createMessage', req.ip)
        return responses.create.success(res)

    } catch (error) {
        if(error.message === "user not found"){return responses.userNotFound(res)}

        console.log(error)
        return responses.serverError(res)
    }
}

messagesController.getMyMessages = async (req, res) => {
    logging('/messages/me')

    try {
        const {ok, data} = await redisHelper.get("messages", `${req.user.id}:${JSON.stringify(req.query)}`)
        if(ok){return responses.getMyMessages.success(res, data)}

        const messages = await MessageModel.getMyMessages({ userId: req.user.id, query: req.query })
        await redisHelper.set("messages", `${req.user.id}:${JSON.stringify(req.query)}`, messages)

        return responses.getMyMessages.success(res, messages)

    } catch (error) {
        console.log(error)
        return responses.serverError(res)
    }
}

messagesController.changeProperties = async (req, res) => {
    logging('/messages/:id')

    const {ok, message, value: body} = validate(MessageSchema.patch, req.body)
    if(!ok){return responses.invalidFormat(res, message)}
    const {ok: ok2, message: message2, value: id} = validate(MessageSchema.id, req.params.id)
    if(!ok2){return responses.invalidFormat(res, message2)}

    try {
        const message = await MessageModel.patch({ id, userId: req.user.id, ...body })
        await redisHelper.delPattern('messages', req.user.id)

        return responses.changeProperties.success(res, message)

    } catch (error) {
        if(error.message === "not found"){return responses.invalidToken(res)}
        
        console.log(error)
        return responses.serverError(res)
    }
}

messagesController.delete = async (req, res) => {
    logging('DELETE /messages/:id')

    const {ok, message, value: id} = validate(MessageSchema.id, req.params.id)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const message = await MessageModel.remove({ id, userId: req.user.id })
        await redisHelper.delPattern('messages', req.user.id)

        return responses.delete.success(res, message)

    } catch (error) {
        if(error.message === "not found"){return responses.invalidToken(res)}

        console.log(error)
        return responses.serverError(res)
    }
}

export default messagesController