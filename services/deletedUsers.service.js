const boom = require('@hapi/boom');
const { Op } = require('sequelize');

const { models } = require('../libs/sequelize');

class DeletedUsers{
    async findAll(query){
        let where = {}

        if (query.id) where.id = query.id;
        if (query.name) {
            where.name = {};
            where.name[Op.substring] = query.name
        }

        return await models.DeletedUsers.findAll({
            where,
            include: [models.PurchaseOrders]
        });
    }

    async delete(id) {
        const deletedUser = await models.DeletedUsers.findByPk(id, {
            include: [{
                model: models.PurchaseOrders
            }]
        });

        if(!deletedUser) throw boom.notFound("There is not a user with that ID");
        
        //If the user have orders, don't delete the user
        if(deletedUser.dataValues.PurchaseOrders.length > 0) throw boom.conflict("The user still have a purchase order");

        deletedUser.destroy();
    }
}

module.exports = DeletedUsers;