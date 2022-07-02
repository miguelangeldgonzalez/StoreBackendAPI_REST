const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const {models} = require('../libs/sequelize');

const config = require('./../config/config');
const UserService = require('./user.service');

const userService = new UserService();

class AuthService {
    singToken(user){
        const payload = {
            sub: user.id,
            role: user.role
        }

        const token = jwt.sign(payload, config.jwtSecret);

        return {
            user,
            token
        }
    }

    async sendMail(mail) {
        const user = await userService.findByEmail(mail);
        if(!user) throw boom.unauthorized();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: config.userEmail,
                pass: config.passEmail
            }
        });

        const payload = {
            sub: user.id
        }

        const token = jwt.sign(payload, config.jwtSecret, {expiresIn: '15min'});
        const link = `https://frontend.com/recovery?${token}`;

        await models.RecoveryTokens.create({token});

        await transporter.sendMail({
            from: config.userEmail,
            to: mail,
            subject: 'Password Recovery',
            text: `Here is your recovery token: ${link}`
        })
    }

    async changePassword(body, tokenQuery){
        try{
            const token = await models.RecoveryTokens.findOne({
                where: {
                    token: tokenQuery
                }
            })

            //Verify if the token is in the data base
            if(!token) throw boom.unauthorized();
            
            //Verify if the token is the same in the data base
            if(token.dataValues.token != tokenQuery) throw boom.unauthorized();

            await token.destroy();
            
            //Verify if the token is singed with this secret and if the token is not expired
            const payload = jwt.verify(tokenQuery, config.jwtSecret);

            const hash = await bcrypt.hash(body.newPassword, 10);
            
            await userService.update(payload.sub, {
                password: hash
            })

        } catch (error) {
            throw error;
        }
    }
}

module.exports = AuthService;