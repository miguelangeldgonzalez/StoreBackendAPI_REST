const Joi = require('joi');

const name = Joi.string();
const id = Joi.string().uuid();

const getDeletedUsersSchema = Joi.object({
    name,
    id
}) 

const deleteDeletedUserSchema = Joi.object({
    id: id.required()
})

module.exports = {getDeletedUsersSchema, deleteDeletedUserSchema};