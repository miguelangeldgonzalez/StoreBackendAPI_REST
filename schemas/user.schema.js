const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().allow(' ').min(2).trim();
const password = Joi.string().alphanum().min(8)
const email = Joi.string().email();
const role = Joi.string().pattern(/admin|user|customer/);

const createUserSchema = Joi.object({
    name: name.required(),
    lastName: name.required(),
    email: email.required(),
    password: password.required(),
})

const getUserSchema = Joi.object({
    id, 
    name
})

const updateUserSchema = Joi.object({
    name: name,
    lastName: name,
    email: email
})

module.exports = { createUserSchema, getUserSchema, updateUserSchema };