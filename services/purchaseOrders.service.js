const { models } = require('../libs/sequelize');
const boom = require('@hapi/boom');
const { Op } = require('sequelize');
const { PURCHASE_ORDERS_TABLE } = require('../db/models/purchaseOrders.model');

class Orders{
    constructor(){
        this.includeAll = {
            include: [
                {
                    model: models.User,
                    as: 'buyer',
                    attributes: {
                        exclude: ['password', 'createdAt']
                    }
                },
                {
                    association: 'orderItems',
                    attributes: ['quantity'],
                    include: [{
                        association: 'product',
                        exclude: ['createdAt']
                    }]
                }
            ],
            attributes: {
                exclude: ['buyerId']
            }
        };
    }
    async findById(id){
        const order = await models.PurchaseOrders.findByPk(id, this.includeAll);

        if(!order){
            throw boom.notFound("Order not found");
        }

        return order;
    }

    async findAll(){
        const orders = await models.PurchaseOrders.findAll(this.includeAll);

        return orders;
    }

    async create(data) {
        //Verify if the product exist and if the stock is grater or equal to the quantity ordered
        for(let i = 0; i < data.orderItems.length; i++){
            let item = data.orderItems[i];
            const product = await models.Products.findByPk(item.productId);
    
            if (!product) {
                throw boom.notFound('There is not a product with that id');  
            } 
    
            if (item.quantity > product.dataValues.stock) {
                throw boom.badRequest(`The quantity of the product is greater than the stock. The product id is: ${item.productId}`);
            }
        }

        //Decrease the stock of the ordered product
        data.orderItems.forEach(async item => {
            const product = await models.Products.findByPk(item.productId);
            await product.update({
                stock: product.dataValues.stock - item.quantity
            })
        })

        //Create the purchase order
        const order = await models.PurchaseOrders.create(
            {
                ...data
            },
            {
                include: [{
                    model: models.OrderItems,
                    as: 'orderItems'
                }]
            } 
        );

        return order;
    }   

    async delete(id){
        const order = await this.findById(id);
        order.dataValues.orderItems.forEach(async item => {

            const stock = item.dataValues.product.dataValues.stock;
            const quantity = item.dataValues.quantity;

            await item.dataValues.product.update({
                stock: stock + quantity
            });
        })

        order.destroy();
    }
}

module.exports = Orders;