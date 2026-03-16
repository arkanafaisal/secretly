import express from 'express'
import authController from '../controller/auth-controller.js'
import rateLimiting from '../middleware/rate-limiting.js'

const authRouter = express.Router()

authRouter.post("/register",                rateLimiting("register"),       authController.register)
authRouter.post('/login',                   rateLimiting('login'),          authController.login)
authRouter.post('/logout',                  rateLimiting('logout'),         authController.logout)

authRouter.post('/refresh',                 rateLimiting('refresh'),        authController.refresh)

authRouter.post('/verify-email/:token',     rateLimiting('verifyEmail'),    authController.verifyEmail)
authRouter.post('/reset-password/:token',   rateLimiting('resetPassword'),  authController.resetPassword)



export default authRouter