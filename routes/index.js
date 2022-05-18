import express from 'express';

import userRouter from './user.router.js';

export default function routerApiV1(app){
    const router = express.Router();
    app.use('/api/v1', router);

    router.use('/user', userRouter);
}