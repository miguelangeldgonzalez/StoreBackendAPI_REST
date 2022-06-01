const Joi = require('joi');

const id = Joi.string().guid();
const price = Joi.number().positive();
const name = Joi.string();
const description = Joi.string();
const stock = Joi.number().positive();
const createdAt = Joi.date();
const discontinued = Joi.boolean();
const field = Joi.string();

const getProductImageSchema = Joi.object({
    id: id.required(),
    field: field.required()
});

const getProductSchema = Joi.object({
    id: id.required()
}); 

const editProductSchema = Joi.object({
    id,
    price,
    name,
    description,
    stock,
    createdAt,
    discontinued
});

const createProductSchema = Joi.object({
    price: price.required(),
    name: name.required(),
    description: description.required(),
    stock: stock.required(),
    createdAt,
    discontinued,
});

const deleteImagesProduct = Joi.object({
    id: id.required(),
    deleteAll: Joi.boolean(),
    images: Joi.array().items(Joi.string())
}).or('deleteAll', 'images');

module.exports = { getProductImageSchema, getProductSchema, deleteImagesProduct, editProductSchema, createProductSchema };