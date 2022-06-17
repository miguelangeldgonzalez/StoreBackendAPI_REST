const express = require('express');
const passport = require('passport');

const { deleteDeletedProducts, getDeletedProducts } = require('../schemas/deletedProducts.schema');
const DeletedProducts = require('../services/deletedProducts.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkAdminRole } = require('../middlewares/auth.handler');

const service = new DeletedProducts();
const router = express.Router();

router.get('/',
    passport.authenticate('jwt', {session: false}),
    checkAdminRole(),
    validatorHandler(getDeletedProducts, 'query'),
    async (req, res) => {
        const rta = await service.findAll(req.query);
        res.json(rta);
    }
);

router.delete('/',
    passport.authenticate('jwt', {session: false}),
    checkAdminRole(),
    validatorHandler(deleteDeletedProducts, 'body'),
    async (req, res, next) => {
        try{
            await service.delete(req.body.id);
            res.status(201).json({
                message: "Product deleted"
            })
        } catch (error) {
            next(error);
        }
    }
)

module.exports = router;