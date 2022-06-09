const express = require('express');
const passport = require('passport');

const OrderService = require('../services/purchaseOrders.service');

const { checkSameOrAdminRole, checkRoles } = require('../middlewares/auth.handler');

const router = express.Router();
const service = new OrderService();

//Get all orders
router.get('/', 
    async (req, res, next) => {
        const orders = await service.findAll();

        res.status(200).send(orders);
    }
);

//Create order
router.post('/',
    async (req, res, next) => {
        try{
            const order = await service.create(req.body);
            res.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }
)

router.delete('/',
    async (req, res, next) => {
        try{
            const rta = await service.delete(req.body.id);
            res.status(200).json({
                message: "Order deleted"
            })
        } catch (error) {
            next(error)
        }
    }
)

//Set as finished
router.post('/finished',
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