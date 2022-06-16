const Joi = require('joi');

const id = Joi.string().uuid();
const price = Joi.number();

const getSalesSchema = Joi.object({
    id,
    productId: id,
    maxPrice: price,
    minPrice: price,
    maxQuantity: price,
    minQuantity: price
})

const editSalesSchema = Joi.object({
    id: id.required(),
    price,
    quantity: price
})

const deleteSalesSchema = Joi.object({
    id
})

module.exports = { getSalesSchema, editSalesSchema, deleteSalesSchema };