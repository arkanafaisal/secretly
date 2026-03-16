import express from 'express'

import jwtVerify from '../middleware/jwt-verify.js'
import messagesController from '../controller/messages-controller.js'
import rateLimiting from '../middleware/rate-limiting.js'



const messagesRouter = express.Router()


messagesRouter.get('/me',               rateLimiting('getMyMessages'),              jwtVerify,  messagesController.getMyMessages)

messagesRouter.post('/send/:publicId',  rateLimiting('createMessage'),                          messagesController.create)
messagesRouter.patch('/:id',            rateLimiting('changeMessageProperties'),    jwtVerify,  messagesController.changeProperties)
messagesRouter.delete('/:id',           rateLimiting('deleteMessage'),              jwtVerify,  messagesController.delete)




export default messagesRouter