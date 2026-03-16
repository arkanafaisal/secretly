import bcrypt from "bcrypt"
import { nanoid } from 'nanoid'
import { randomUUID } from 'crypto'


import * as UserModel from '../model/user-model.js'
import * as UserSchema from '../schema/user-schema.js'
import * as redisHelper from "../utils/redis-helper.js"

import { logging } from "../utils/logger.js"
import { validate } from "../utils/validate.js"
import { response } from "../utils/response.js"
import { sendMail } from '../utils/mailer.js'
import { isStrictClean } from "../utils/filter.js"
import { incrbyRateLimit } from "../middleware/rate-limiting.js"


const usersController = {}
const responses = {
    serverError: (res)=>{return response(res, false, 500, "server error")},
    invalidToken: (res)=>{return response(res, false, 403, "invalid token")},
    invalidFormat: (res, message)=>{return response(res, false, 400, message)},

    duplicate: (res)=>{return response(res, false, 409, "already used")},
    userNotFound: (res)=>{return response(res, false, 404, "user not found")},
    
    profileFound: (res, data)=>{return response(res, true, 200, "profile found", data)},
    updateSuccess: (res, data)=>{return response(res, true, 200, "update success", data)},

    updatePassword: {
        wrongPassword: (res)=>{return response(res, false, 401, "wrong password")},
        success: (res)=>{return response(res, true, 200, "password updated")},
    },
    updateEmail: {
        failed: (res)=>{return response(res, false, 500, "please try again")},
        success: (res)=>{return response(res, true, 200, "verification link sent")},
    },
    resetPassword: {
        failed: (res)=>{return response(res, false, 500, "please try again")},
        success: (res)=>{return response(res, true, 200, "reset-password link sent")},
    }
}

usersController.getMyProfile = async (req, res) => {
    logging('/users/me')

    try {
        const {ok, data} = await redisHelper.get("profile", req.user.id)
        if(ok){return responses.profileFound(res, data)}

        const user = await UserModel.getUserById({id: req.user.id})
        if(!user){
            await redisHelper.del("profile", req.user.id)
            return responses.userNotFound(res)
        }

        await redisHelper.set("profile", req.user.id, user)
        return responses.profileFound(res, user)

    } catch (error) {
        console.log(error)
        return responses.serverError(res)
    }
}

usersController.getProfile = async (req, res) => {
    logging('/users/:publicId')

    const {ok, message, value: publicId} = validate(UserSchema.publicId, req.params.publicId)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const {ok, data} = await redisHelper.get("publicProfile", publicId)
        if(ok){return responses.profileFound(res, data)}

        const user = await UserModel.getUserByPublicId({ publicId })
        if(!user){
            await redisHelper.del("publicProfile", publicId)
            return responses.userNotFound(res)
        }
        
        await redisHelper.set("publicProfile", publicId, user)
        return responses.profileFound(res, user)

    } catch (error) {
        console.log(error)
        return responses.serverError(res)
    }
}

usersController.toggleAllowMessages = async (req, res) => {
    logging('/users/me/allow-messages')

    const {ok, message, value} = validate(UserSchema.allowMessages, req.body.allowMessages)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const { publicId, allowMessages} = await UserModel.updateUserField({id: req.user.id, field: "allowMessages", value})
        await incrbyRateLimit('toggleAllowMessages', req.ip)

        await redisHelper.del("profile", req.user.id)
        await redisHelper.del("publicProfile", publicId)
        return responses.updateSuccess(res, allowMessages)
        
    } catch (error) {
        if(error.message === "not found"){return responses.invalidToken(res)}

        console.log(error)
        return responses.serverError(res)
    }
}

usersController.updateBio = async (req, res) => {
    logging('/users/me/bio')

    const {ok, message, value} = validate(UserSchema.bio, req.body.bio)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const { publicId, bio } = await UserModel.updateUserField({id: req.user.id, field: "bio", value})
        await incrbyRateLimit('updateBio', req.ip)
        
        await redisHelper.del("profile", req.user.id)
        await redisHelper.del("publicProfile", publicId)
        return responses.updateSuccess(res, bio)

    } catch (error) {
        if(error.message === "not found"){return responses.invalidToken(res)}

        console.log(error)
        return responses.serverError(res)
    }
}

usersController.updateUsername = async (req, res) => {
    logging('/users/me/username')

    const {ok, message, value} = validate(UserSchema.username, req.body.username)
    if(!ok){return responses.invalidFormat(res, message)}
    if(!isStrictClean(value)){return response(res, false, 400, "contain bad words")}

    try {
        const { publicId, username } = await UserModel.updateUserField({id: req.user.id, field: "username", value})
        await incrbyRateLimit('updateUsername', req.ip)

        await redisHelper.del("profile", req.user.id)
        await redisHelper.del("publicProfile", publicId)
        return responses.updateSuccess(res, username)

    } catch (error) {
        if(error.message === "not found"){return responses.invalidToken(res)}
        if(error.message === "duplicate"){return responses.duplicate(res)}

        console.log(error)
        return responses.serverError(res)
    }
}

usersController.updateAvatarIndex = async (req, res) => {
    logging('/users/me/avatar')

    const {ok, message, value} = validate(UserSchema.avatarIndex, req.body.avatarIndex)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const { publicId, avatarIndex } = await UserModel.updateUserField({id: req.user.id, field: "avatarIndex", value})
        await incrbyRateLimit('updateAvatarIndex', req.ip)

        
        await redisHelper.del("profile", req.user.id)
        await redisHelper.del("publicProfile", publicId)
        return responses.updateSuccess(res, avatarIndex)
        
    } catch (error) {
        if(error.message === "not found"){return responses.invalidToken(res)}

        console.log(error)
        return responses.serverError(res)
    }
}

usersController.refreshPublicId = async (req, res) => {
    logging('/users/public-id')

    try {
        const publicId = nanoid()
        const { publicId: publicId2 } = await UserModel.updateUserField({ id: req.user.id, field: 'publicId', value: publicId })
        await incrbyRateLimit('refreshPublicId', req.ip)

        await redisHelper.del("profile", req.user.id)
        await redisHelper.del("publicProfile", publicId2)
        return responses.updateSuccess(res, publicId2)

    } catch (error) {
        if(error.message === "duplicate"){return responses.duplicate(res)}
        if(error.message === "not found"){return responses.invalidToken(res)}

        console.log(error)
        return responses.serverError(res)
    }
}

usersController.updatePassword = async (req, res) => {
    logging('/users/password')

    const {ok, message, value: { oldPassword, newPassword }} = validate(UserSchema.updatePassword, req.body)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const storedPassword = await UserModel.getPasswordById({ id: req.user.id })
        if(!storedPassword){return responses.invalidToken(res)}

        const ok2 = await bcrypt.compare(oldPassword, storedPassword)
        if(!ok2){return responses.updatePassword.wrongPassword(res)}

        const hashed = await bcrypt.hash(newPassword, 10)
        await UserModel.updatePassword({ id: req.user.id, password: hashed })

        await incrbyRateLimit('updatePassword', req.ip)
        return responses.updatePassword.success(res)

    } catch (error) {
        if(error.message === "not found"){return responses.invalidToken(res)}

        console.log(error)
        return responses.serverError(res)
    }
}

usersController.sendEmailVerification = async (req, res) => {
    logging('/users/email')

    const {ok, message, value: email} = validate(UserSchema.email, req.body.email)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const id2 = await UserModel.checkUsedEmail({ email })
        if(id2){return responses.duplicate(res)}

        const token = randomUUID()
        const {ok: ok2} = await redisHelper.set("email-verify", token, { id: req.user.id, email })
        if(!ok2){return responses.updateEmail.failed(res)}

        await sendMail.verifyEmail({newEmail: email, token})
        await incrbyRateLimit('sendEmailVerification', req.ip)
        return responses.updateEmail.success(res)

    } catch (error) {
        console.log(error)
        return responses.serverError(res)
    }
}

usersController.sendResetPassword = async (req, res) => {
    logging('/users/forgot-password')

    const {ok, message, value: email} = validate(UserSchema.email, req.body.email)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const token = randomUUID()
        const {ok} = await redisHelper.set('reset-password', token, { email })
        if(!ok){return responses.resetPassword.failed(res)}

        await sendMail.resetPassword({ email, token })
        await incrbyRateLimit('sendResetPassword', req.ip)
        return responses.resetPassword.success(res)

    } catch (error) {
        console.log(error)
        return responses.serverError(res)
    }
}


export default usersController