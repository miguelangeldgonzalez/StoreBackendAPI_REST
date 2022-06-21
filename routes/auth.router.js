const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

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
    async (req, res, next) => {
        try{
            const user = await service.sendMail(req.body.mail);
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
            const change = await service.changePassword(req.body, req.query.token);
            res.json({
                message: 'Password changed'
            })
        }catch(error){
            next(error)
        }
    }
)

module.exports = router;