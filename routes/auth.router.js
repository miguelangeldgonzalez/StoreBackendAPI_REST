const express = require('express');
const passport = require('passport');

const router = express.Router();

const {recoverySchema} = require('../schemas/auth.schema');

const validatorHandler = require('../middlewares/validator.handler');
const AuthService = require('../services/auth.service');

const service = new AuthService();

router.post('/login', 
    passport.authenticate('local', {session: false}),
    async (req, res, next) => {
        try{
            const user = service.singToken(req.user);
            res.json(user);
        } catch(error){
            next(error)
        }
    }
);

router.post('/recovery',
    validatorHandler(recoverySchema, 'body'),
    async (req, res, next) => {
        try{
            await service.sendMail(req.body.email);
            res.json({
                message: 'Email sent'
            })
        } catch(error){
            next(error)
        }
    }
);

router.post('/change-password/:token',
    async (req, res, next) => {
        try {
            await service.changePassword(req.body, req.params.token);
            res.json({
                message: 'Password changed'
            })
        }catch(error){
            next(error)
        }
    }
)

module.exports = router;