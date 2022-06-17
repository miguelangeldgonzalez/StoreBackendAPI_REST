const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const {models} = require('sequelize');

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
        const user = userService.findByEmail(mail);
        if(!user) throw boom.unauthorized();

        const transporter = nodemailer.createTransporter({
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

        models.RecoveryTokens.create(token);

        await transporter.sendMail({
            from: config.userEmail,
            to: mail,
            subject: 'Password Recovery',
            text: `Click here to recovery your password: ${link}`
        })
    }

    async changePassword(body){
        try{
            const token = await models.RecoveryTokens.findOne({
                where: {
                    token: body.token
                }
            })

            //Verify if the token is in the data base
            if(!token) throw boom.unauthorized();

            //Verify if the token is the same in the data base
            if(token.dataValues.token != body.token) throw boom.unauthorized();

            //Verify if the token is singed with this secret and if the token is not expired
            const payload = jwt.verify(body.token, config.jwtSecret);

            const user = await userService.findById(payload.sub);

            //Verify if the user of the payload exists
            if(!user) throw boom.unauthorized();

            const hash = await bcrypt.hash(body.newPassword, 10);
            
            await user.update({
                password: hash
            })

            await token.destroy()
        } catch (error) {
            throw boom.unauthorized();
        }
    }
}

module.exports = AuthService;