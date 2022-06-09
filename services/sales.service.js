const { models } = require('../libs/sequelize');

class Sales {
    async findAll(){
        return await models.Sales.findAll({
            include: [models.Products, models.DeletedProducts],
            attributes: ['id', 'price']
        });
    }

    async create(data){
        return await models.Sales.create(data);
    }
}

module.exports = Sales;