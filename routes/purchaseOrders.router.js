const express = require('express');
const passport = require('passport');

const OrderService = require('../services/purchaseOrders.service');

const { checkSameOrAdminRole, checkAdminRole } = require('../middlewares/auth.handler');
const validatorHandler = require('../middlewares/validator.handler');

const { createOrderSchema, 
        getChangeOrderSchema, 
        getOrderSchema, 
        editOrderSchema } = require('../schemas/purchaseOrders.schema.js');

const router = express.Router();
const service = new OrderService();

//Get all orders
router.get('/',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(getOrderSchema, 'query'),
    async (req, res) => {
        const orders = await service.findAll(req.user, req.query);

        res.status(200).send(orders);
    }
);

//Create order
router.post('/',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(createOrderSchema, 'body'),
    async (req, res, next) => {
        console.log(req.user);
        if(req.user.role != "admin") {
            req.body.buyerId = req.user.sub;
        } else {
            if(req.body.buyerId == undefined){
                req.body.buyerId = req.user.sub;
            }
        }

        try{
            const order = await service.create(req.body);
            console.log("hola");
            res.status(201).send(order);
        } catch (error) {
            next(error);
        }
    }
)

//Delete
router.delete('/',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(getChangeOrderSchema, 'body'),
    async (req, res, next) => {
        try{
            const rta = await service.delete(req.body.id, req.user);
            res.status(200).json({
                message: "Order deleted"
            })
        } catch (error) {
            next(error)
        }
    }
)

//Edit order only direction
router.patch('/',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(editOrderSchema, 'body'),
    checkAdminRole(),
    async (req, res, next) => {
        try{
            const rta = await service.update(req.body);
            res.status(201).json(rta);
        }catch (error) {
            next(error)
        }
    }
)

//Set as finished
router.patch('/set_as_finished',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(getChangeOrderSchema, 'body'),
    checkAdminRole(),
    async (req, res, next) => {
        try {
            const rta = await service.setAsFinished(req.body);
            res.status(200).json(rta);
        } catch (error) {
            next(error)
        }
    }
)

module.exports = router;