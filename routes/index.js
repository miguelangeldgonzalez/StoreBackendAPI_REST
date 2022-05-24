const express = require('express');

const userRouter = require('./user.router.js');
const authRouter = require('./auth.router.js');;

function routerApiV1(app){
    const router = express.Router();
    app.use('/api/v1', router);

    router.use('/user', userRouter);
    router.use('/auth', authRouter);
}

module.exports = routerApiV1;