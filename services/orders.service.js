const { models } = require('../libs/sequelize');

class Orders{
    async findAll(){
        const rta = await models.PurchaseOrders.findAll({
            include: [
                {
                    model: models.User,
                    as: 'buyer',
                    attributes: ['id', 'email', 'name', 'last_name', 'role']
                },{
                    model: models.OrderItems,
                    as: 'orderItems',
                    attributes: ['quantity'],
                    include: [{
                        model: models.Products,
                        as: 'product',
                        attributes: ['id', 'price', 'name', 'description']
                    }]
                }
            ],
            attributes: {
                exclude: ['buyerId']
            }
        });

        return rta;
    }
}

module.exports = Orders;