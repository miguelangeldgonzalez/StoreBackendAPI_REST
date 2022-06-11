const Joi = require('joi');

const self = Joi.boolean();
const offset = Joi.number();
const id = Joi.string().guid();
const buyerId = Joi.string().guid();
const direction = Joi.string();

const orderItems = Joi.array().items(Joi.object({
    quantity: Joi.number().positive().required(),
    productId: Joi.string().guid().required()
}));

const createOrderSchema = Joi.object({
    buyerId: buyerId,
    direction: direction.required(),
    orderItems: orderItems.required()
});

const getChangeOrderSchema = Joi.object({id});

const editOrderSchema = Joi.object({
    id,
    direction
})

const getOrderSchema = Joi.object({
    id,
    self,
    finished: self,
    notFinished: self,
    offset,
    limit: offset,
    buyerId
})


module.exports = {createOrderSchema, getChangeOrderSchema, getOrderSchema, editOrderSchema};