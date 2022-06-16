const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class DeletedUsers{
    async findAll(query){
        return await models.DeletedUsers.findAll();
    }
}

module.exports = DeletedUsers;