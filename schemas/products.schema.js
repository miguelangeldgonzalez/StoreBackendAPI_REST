const Joi = require('joi');

const id = Joi.string().guid();
const field = Joi.string();

const getProductSchema = Joi.object({
    id: id.required(),
    field: field.required()
})

module.exports = { getProductSchema };