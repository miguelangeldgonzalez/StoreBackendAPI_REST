const {Op} = require('sequelize');
const boom = require('@hapi/boom');

const {models} = require('../libs/sequelize');

class DeletedProducts {
    async findAll(query){
        let where = {};

        if(query.id) where.id = query.id;
        
        if(query.less_than || query.greater_than) {
            where.price = {};

            if(query.lessThan) where.price[Op.lte] = query.lessThan;
            if(query.greaterThan) where.price[Op.gte] = query.greaterThan;
        }

        if(query.name) where.name = {
            [Op.substring]: query.name
        }

        return await models.DeletedProducts.findAll({
            where,
            include: [models.Sales]
        });
    }

    async delete(id) {
        const deletedProduct = await models.DeletedProducts.findByPk(id, {
            include: [models.Sales]
        });

        //Verify if the product has sales
        if(deletedProduct.dataValues.Sales.length > 0) throw boom.conflict('This product has sales');

        deletedProduct.destroy();
    }


}

module.exports = DeletedProducts;