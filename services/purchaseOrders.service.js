const boom = require('@hapi/boom');
const { Sequelize } = require('sequelize');

const { models } = require('../libs/sequelize');


class Orders{
    constructor(){
        this.includeAll = {
            include: [
                {
                    model: models.User,
                    attributes: {
                        exclude: ['password', 'createdAt', 'role']
                    }
                },
                {
                    association: 'orderItems',
                    attributes: ['id', 'quantity'],
                    include: [{
                        association: 'product',
                        exclude: ['createdAt']
                    }]
                }
            ],
            attributes: {
                exclude: ['buyer_id']
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
        //Verify if the user exists
        const user = await models.User.findByPk(data.buyerId);
        if (!user) throw boom.notFound('There is not a user with that id');

        let products = [];

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

            products.push(product);
        }

        //Decrease the stock of the ordered product
         for(let i = 0; i < products.length; i++){
             const item = data.orderItems[i];
             const product = products[i];
             
             await product.update({
                 stock: product.dataValues.stock - item.quantity
             })
         }

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

    async setAsFinished(data) {
        const order = await this.findById(data.id);

        if(order.dataValues.finishedAt != null)  throw boom.badRequest('The order is already set as finished');

        await order.dataValues.orderItems.forEach(async item => {
            const product = item.dataValues.product.dataValues;
            await models.Sales.create({
                price: product.price,
                productId: product.id,
                purchaseOrderId: order.dataValues.id,
                quantity: item.dataValues.quantity
            })

            await item.destroy();
        });

        await order.update({
            finishedAt: data.date != undefined ? data.date : new Date(Date.now()).toISOString()
        });

        return order;
    }
}

module.exports = Orders;