const express = require('express');
const passport = require('passport');

const OrderService = require('../services/orders.service');

const { checkSameOrAdminRole, checkRoles } = require('../middlewares/auth.handler');

const router = express.Router();
const service = new OrderService();

router.get('/', 
    async (req, res, next) => {
        const orders = await service.findAll();

        res.status(200).send(orders);
    }
);

module.exports = router;