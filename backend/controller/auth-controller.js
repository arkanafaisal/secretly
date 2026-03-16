import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { randomUUID } from 'crypto'
import { nanoid } from 'nanoid'

import * as UserSchema from '../schema/user-schema.js'
import * as AuthModel from '../model/auth-model.js'
import * as redisHelper from '../utils/redis-helper.js'

import { validate } from '../utils/validate.js'
import { response } from '../utils/response.js'
import { logging } from "../utils/logger.js"
import { isStrictClean } from '../utils/filter.js'
import { incrbyRateLimit } from "../middleware/rate-limiting.js"

const authController = {}

const refreshTokenOption = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "development"? 'none' : 'Lax',
    secure: true,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
}

const responses = {
    serverError: (res)=>{return response(res, false, 500, "server error")},
    invalidFormat: (res, message)=>{return response(res, false, 400, message)},
    unauthorized: (res)=>{return response(res, false, 401, "token invalid")},
    forbidden: (res)=>{return response(res, false, 403, "token invalid")},

    
    register: {
        duplicate: (res)=>{return response(res, false, 409, "already exist")},
        badWords: (res)=>{return response(res, false, 400, "contain bad words")},
        createSuccess: (res, accessToken)=>{return response(res, true, 201, "user created", accessToken)}
    },
    login: {
        incorrectCredential: (res)=>{return response(res, false, 401, "username or password incorrect")},
        success: (res, accessToken)=>{return response(res, true, 200, "login success", accessToken)}
    },
    refresh: {
        success: (res, accessToken)=>{return response(res, true, 200, "access token created", accessToken)}
    },
    logout: {
        success: (res)=>{return response(res, true, 200, "logout success")}
    },

    verifyEmail: {
        duplicate: (res)=>{return response(res, false, 409, "email is already used")},
        success: (res)=>{return response(res, true, 200, "email verified")}
    },
    resetPassword: {
        notMatched: (res)=>{return response(res, false, 400, "passwords isn't matched")},
        success: (res)=>{return response(res, true, 200, "password changed")}
    }
}

authController.register = async (req, res) => {
    logging('/auth/register')

    const {ok, message, value: body} = validate(UserSchema.register, req.body)
    if(!ok){return responses.invalidFormat(res, message)}
    if(!isStrictClean(body.username)){return responses.register.badWords(res)}

    try {
        const hashed = await bcrypt.hash(body.password, 10)
        const publicId = nanoid()
        const user = await AuthModel.register({...body, password: hashed, publicId})
        if(!user){return responses.serverError(res)}

        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '10m'})
        const refreshToken = randomUUID()

        const {ok:ok2} = await redisHelper.set("tokens", refreshToken, user.id)
        if(!ok2){return responses.serverError(res)}
        res.cookie('refreshToken', refreshToken, refreshTokenOption)

        await incrbyRateLimit('register', req.ip)
        return responses.register.createSuccess(res, accessToken)
    } catch (error) {
        console.log(error)
        if(error.message === "duplicate"){return responses.register.duplicate(res)}
        return responses.serverError(res)
    }
}

authController.login = async (req, res) => {
    logging('/auth/login')

    const {ok, message, value: body} = validate(UserSchema.login, req.body)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const user = await AuthModel.getUserByUsername({ username: body.username })
        if(!user){return responses.login.incorrectCredential(res)}

        const ok2 = await bcrypt.compare(body.password, user.password)
        if(!ok2){return responses.login.incorrectCredential(res)}

        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {expiresIn: '10m'})
        const refreshToken = randomUUID()

        const {ok:ok3} = await redisHelper.set("tokens", refreshToken, user.id)
        if(!ok3){return responses.serverError(res)}
        res.cookie('refreshToken', refreshToken, refreshTokenOption)

        await incrbyRateLimit('login', req.ip)
        return responses.login.success(res, accessToken)
    } catch (error) {
        console.log(error)
        return responses.serverError(res)
    }
}


authController.refresh = async (req, res) => {
    logging('/auth/refresh')

    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){return responses.unauthorized(res)}
    
    try {
        const {ok, data} = await redisHelper.get("tokens", refreshToken)
        if(!ok){return responses.forbidden(res)}
        
        const id = await AuthModel.validateUserById({ id: data })
        if(!id){
            res.clearCookie("refreshToken", refreshTokenOption)
            await redisHelper.del("tokens", refreshToken)
            return responses.forbidden(res)
        }

        const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '10m'})
        return responses.refresh.success(res, accessToken)
    } catch (error) {
        console.log(error)
        return responses.serverError(res)
    }
}

authController.logout = async (req, res) => {
    logging('/auth/logout')

    const refreshToken = req.cookies.refreshToken
    if(refreshToken){
        (async () => {
            try {
                for(let i = 0; i < 3; i++){
                    const {ok} = await redisHelper.del('tokens', refreshToken)
                    if(ok) break
                    await new Promise(r => setTimeout(r, 500))
                }
            } catch (err) { console.error("Logout background cleanup failed", err) }
        })()
    }

    res.clearCookie('refreshToken', refreshTokenOption)
    return responses.logout.success(res)
}

authController.verifyEmail = async (req, res) => {
    logging('/auth/verify-email/:token')

    const {ok, message, value: token} = validate(UserSchema.token, req.params.token)
    if(!ok){return responses.invalidFormat(res, message)}

    try {
        const {ok: ok2, data} = await redisHelper.get("email-verify", token)
        if(!ok2){return responses.forbidden(res)}

        const id = await AuthModel.updateEmail(data)
        await redisHelper.del('email-verify', token)
        await redisHelper.del('profile', id)

        await incrbyRateLimit('verifyEmail', req.ip)
        return responses.verifyEmail.success(res)

    } catch (error) {
        if(error.message === "duplicate"){return responses.verifyEmail.duplicate(res)}
        if(error.message === "not found"){return responses.forbidden(res)}

        console.log(error)
        return responses.serverError(res)
    }
}

authController.resetPassword = async (req, res) => {
    logging('/auth/reset-password/:token')

    const {ok, message, value: token} = validate(UserSchema.token, req.params.token)
    if(!ok){return responses.invalidFormat(res, message)}
    const {ok: ok2, message: message2, value: body} = validate(UserSchema.resetPassword, req.body)
    if(!ok2){return responses.invalidFormat(res, message2)}
    const { password, confirmPassword } = body
    if(password !== confirmPassword){return responses.resetPassword.notMatched(res)}

    try {
        const {ok: ok3, data} = await redisHelper.get("reset-password", token)
        if(!ok3){return responses.forbidden(res)}

        const hashed = await bcrypt.hash(password, 10)
        await AuthModel.updatePassword({ ...data, password: hashed })
        await redisHelper.del('reset-password', token)

        await incrbyRateLimit('resetPassword', req.ip)
        return responses.resetPassword.success(res)

    } catch (error) {
        if(error.message === "not found"){return responses.forbidden(res)}

        console.log(error)
        return responses.serverError(res)
    }
}







export default authController