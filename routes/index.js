const express = require('express');

const userRouter = require('./user.router');
const authRouter = require('./auth.router');
const salesRouter = require('./sales.router');
const productsRouter = require('./products.router');
const deletedUsersRouter = require('./deletedUsers.router');
const purchaseOrdersRouter = require('./purchaseOrders.router');
const deletedProductsRouter = require('./deletedProducts.router');

function routerApiV1(app){
    const router = express.Router();
    app.use('/api/v1', router);

    router.use('/user', userRouter);
    router.use('/auth', authRouter);
    router.use('/sales', salesRouter);
    router.use('/products', productsRouter);
    router.use('/deleted_users', deletedUsersRouter)
    router.use('/purchase_orders', purchaseOrdersRouter);
    router.use('/deleted_products', deletedProductsRouter);
}

module.exports = routerApiV1;