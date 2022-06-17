const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string();
const price = Joi.number();

const getDeletedProducts = Joi.object({
    id,
    name,
    less_than: price,
    greater_than: price
})

const deleteDeletedProducts = Joi.object({
    id: id.required()
})

module.exports = { deleteDeletedProducts, getDeletedProducts };