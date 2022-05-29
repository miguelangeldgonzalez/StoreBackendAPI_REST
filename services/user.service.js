const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const fs = require('fs-extra');
const Jimp = require('jimp');
const path = require('path');

const { models } = require('./../libs/sequelize.js');

class UserService{
    async create(data){
        const hash = await bcrypt.hash(data.password, 10);
        const newUser = await models.User.create({
            ...data,
            password: hash
        });
        delete newUser.dataValues.password;
        return newUser;
    }

    findProfilePhoto(userId){
        const image = path.resolve(`./public/profile_photos/${userId}.png`);
        
        if(fs.pathExistsSync(image)){
            return `http://localhost:3000/public/profile_photos/${userId}.png`;
        } else {
            return false;
        }
    }

    async findById(id){
        const userSearched = await models.User.findByPk(id);

        if(!userSearched){
            throw boom.notFound('User not found');
        }

        let user = userSearched.dataValues;
        user.image = this.findProfilePhoto(user.id);
        delete user.password;

        return user;
    }

    async findByEmail(email){
        const rta = await models.User.findOne({
            where: { email }
        });
        return rta;
    }

    async findAll(){
        const rta = await models.User.findAll({
            attributes: { 
                exclude: ['password'] 
            }
        });

        const users = rta.map(user => ({
            ...user.dataValues,
            image: this.findProfilePhoto(user.dataValues.id)
        }));

        return users;
    }

    async update(id, changes){
        const user = await models.User.findByPk(id);

        if(!user){
            throw boom.notFound('User not found');
        }

        const rta = await user.update(changes);
        delete rta.dataValues.password;
        return rta;
    }

    async delete(id){
        const user = await models.User.findByPk(id);

        if(!user){
            throw boom.notFound('User not found');
        }

        const rta = await user.destroy();
        return rta;
    }

    async deleteProfilePhoto(userId){
        const imagePath = path.resolve(`./public/profile_photos/${userId}.png`);

        if(fs.pathExistsSync(imagePath)){
            await fs.remove(imagePath);
            return true;
        }else{
            throw boom.notFound("Error: The user doesn't have profile image");
        }

    }
    async loadProfileImage(file, userId){
        try{
            const destination = path.resolve(`./public/profile_photos/${userId}.png`);
            const image = await Jimp.read(file.path);
    
            await image.write(destination); // save
            
            await fs.remove(file.path);
        } catch (error) {
            throw boom.internal("The image could not be saved. Something went wrong on the server");
        }
    }
}

module.exports = UserService;