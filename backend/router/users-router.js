import express from 'express'
import usersController from '../controller/users-controller.js'
import jwtVerify from '../middleware/jwt-verify.js'
import rateLimiting from '../middleware/rate-limiting.js'

const usersRouter = express.Router()

usersRouter.get('/me',                  rateLimiting('getMyProfile'),           jwtVerify,  usersController.getMyProfile)
usersRouter.get('/:publicId',           rateLimiting('getProfile'),                         usersController.getProfile)


usersRouter.post('/me/public-id',       rateLimiting('refreshPublicId'),        jwtVerify,  usersController.refreshPublicId)

usersRouter.put('/me/username',         rateLimiting('updateUsername'),         jwtVerify,  usersController.updateUsername)
usersRouter.put('/me/password',         rateLimiting('updatePassword'),         jwtVerify,  usersController.updatePassword)
usersRouter.put('/me/bio',              rateLimiting('updateBio'),              jwtVerify,  usersController.updateBio)
usersRouter.put('/me/avatar',           rateLimiting('updateAvatarIndex'),      jwtVerify,  usersController.updateAvatarIndex)
usersRouter.put('/me/allow-messages',   rateLimiting('toggleAllowMessages'),    jwtVerify,  usersController.toggleAllowMessages)

usersRouter.put('/me/email',            rateLimiting('sendEmailVerification'),  jwtVerify,  usersController.sendEmailVerification)
usersRouter.post('/forgot-password',    rateLimiting('sendResetPassword'),                  usersController.sendResetPassword)


export default usersRouter