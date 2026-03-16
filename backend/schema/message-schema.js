import Joi from 'joi'


export const id = Joi.number().integer().required()
const message = Joi.string().min(2).max(300).custom((value, helpers) => {
    const lines = value.split('\n').length
    if (lines > 10) return helpers.error('any.invalid')
    return value
  }).required()
const hint = Joi.string().max(20).allow(null).optional()
const read = Joi.boolean().valid(true)
const starred = Joi.boolean()




export const create = Joi.object({
    message,
    hint
})

export const patch = Joi.object({
  read,
  starred
}).xor('read', 'starred')