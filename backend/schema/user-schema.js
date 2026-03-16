import Joi from 'joi'


export const username = Joi.string().min(3).max(20).pattern(/^[a-zA-Z0-9_]+$/).required()
const password = Joi.string().min(6).max(255).required()
const emailNotRequired = Joi.string().email().max(254)
export const email = emailNotRequired.required()
export const bio = Joi.string().max(120).custom((value, helpers) => {
    const lines = value.split('\n').length
    if (lines > 4) return helpers.error('any.invalid')
    return value
  }).required()

export const publicId = Joi.string().length(21).pattern(/^[A-Za-z0-9_-]+$/).required()
export const allowMessages = Joi.boolean().required()
export const avatarIndex = Joi.number().integer().required()

export const token = Joi.string().uuid({ version: "uuidv4" }).required()


export const register = Joi.object({
    username,
    email: emailNotRequired,
    password
})

export const login = Joi.object({
    username, 
    password
})

export const updatePassword = Joi.object({
    oldPassword: password,
    newPassword: password
})

export const resetPassword = Joi.object({
    password,
    confirmPassword: password
})