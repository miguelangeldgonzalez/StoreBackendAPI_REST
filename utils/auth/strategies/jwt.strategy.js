const { Strategy, ExtractJwt } = require('passport-jwt');
const Joi = require('joi');
const boom = require('@hapi/boom');

const {models} = require('./../../../libs/sequelize');
const config = require('./../../../config/config.js');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret
}

const JwtStrategy = new Strategy(options, async (payload, done) => {
    try{
        Joi.object({sub: Joi.string().guid()}).validate({sub: payload.sub});
        const user = await models.User.findByPk(payload.sub);

        if(!user) throw boom.forbidden();
        
        return done(null, payload);
    }catch(error){ 
        var e = new Error('Invalid token');
        return done(boom.boomify(e, {statusCode: 498, error: "Token expired/invalid" }), false)
    }
    
    
});

module.exports = JwtStrategy;