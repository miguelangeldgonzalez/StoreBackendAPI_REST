const express = require('express');
const passport =  require('passport');

const { getSalesSchema, editSalesSchema, deleteSalesSchema } = require('../schemas/sales.chema');
const validatorHandler = require('../middlewares/validator.handler');
const { checkAdminRole } = require('../middlewares/auth.handler');
const SalesService = require('../services/sales.service');

const service = new SalesService();

const router = express.Router();

router.get('/', 
    passport.authenticate('jwt', {session: false}),
    checkAdminRole(),
    validatorHandler(getSalesSchema, 'query'),
    async (req, res, next) => {
        const rta = await service.findAll(req.query);
        res.json(rta);
    }
);

//Edit Sale
router.patch('/', 
    passport.authenticate('jwt', {session: false}),
    checkAdminRole(),
    validatorHandler(editSalesSchema, 'body'),
    async (req, res, next) => {
        try {
            const rta = await service.update(req.body);
            res.json(rta);
        } catch (error) {
            next(error);
        }
    }
)

router.delete('/', 
    passport.authenticate('jwt', {session: false}),
    checkAdminRole(), 
    validatorHandler(deleteSalesSchema, 'body'),
    async (req, res, next) => {
        try{
            const rta = await service.delete(req.body.id);
            res.json({
                message: "Sale deleted"
            })
        } catch (error) {
            next(error);
        }
    }
)

module.exports = router;