const express = require('express');

const userRouter = require('./user.router');
const authRouter = require('./auth.router');
const salesRouter = require('./sales.router');
const productsRouter = require('./products.router');
const purchaseOrders = require('./purchaseOrders.router');

function routerApiV1(app){
    const router = express.Router();
    app.use('/api/v1', router);

    router.use('/user', userRouter);
    router.use('/auth', authRouter);
    router.use('/sales', salesRouter);
    router.use('/products', productsRouter);
    router.use('/purchase_orders', purchaseOrders);
}

module.exports = routerApiV1;