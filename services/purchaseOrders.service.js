const boom = require('@hapi/boom');
const { Op, Sequelize } = require('sequelize');

const { models } = require('../libs/sequelize');


class Orders{
    constructor(){
        this.includeAll = {
            include: [
                {
                    model: models.User,
                    attributes: {
                        exclude: ['password', 'role']
                    }
                },{
                    model: models.DeletedUsers
                },{
                    association: 'orderItems',
                    attributes: ['id', 'quantity'], //DON'T CHANGE IF YOU WANNA LIVE
                    include: [{
                        association: 'product',
                        exclude: ['createdAt']
                    }]
                }
            ],
            attributes: {
                exclude: ['buyer_id', 'buyerId']
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

    async findAll(user, query){
        let include = this.includeAll;
        include.where = {};

        if(user.role != "admin" || query.self) include.where = {
            buyerId: user.sub
        }
        if(user.role == 'admin' && query.buyerId != undefined) include.where.buyerId = query.buyerId;

        if(query.finished) include.where.finishedAt = {
            [Op.not]: null
        }
        if(query.notFinished) include.where.finishedAt = {
            [Op.is]: null
        }

        if(query.id) include.where.id = query.id
        if(query.offset) include.offset = query.offset;
        if(query.limit) include.limit = query.limit;

        const orders = await models.PurchaseOrders.findAll(include);
        const count = await models.PurchaseOrders.count(include.where);

        return {
            orders,
            count
        };
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
                throw boom.notFound(`There is not a product with the id: ${item.productId}`);  
            } 
    
            if (item.quantity > product.dataValues.stock) {
                throw boom.badRequest(`The quantity of the product is greater than the stock. The stock is ${product.dataValues.stock}. The product id is: ${item.productId}`);
            }

            products.push(product);
        }

        //Decrease the stock of the ordered product
        for (let i = 0; i < products.length; i++) {
             const item = data.orderItems[i];
             const product = products[i];
             
             await product.decrement('stock', {by: item.quantity});
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

    async update(changes){
        const order = await this.findById(changes.id);
        delete changes.id;

        await order.update(changes);
        return order;
    }

    async delete(id, user){
        const order = await this.findById(id);

        if(order.dataValues.buyerId != user.sub){
            if(user.role != 'admin') throw boom.forbidden();
        }

        order.dataValues.orderItems.forEach(async item => {
            const quantity = item.dataValues.quantity;

            await item.dataValues.product.increment('stock', {by: quantity});
        })

        order.destroy();
    }

    async deleteFinishedPurchaseOrder(id){
        const order = await this.findById(id, {
            where: {
                createdAt: {
                    [Op.not]: null
                }
            }
        });

        //Verify if the user is a deleted user
        if(!order.dataValues.buyer.createdAt){
            const deletedUser = await models.DeletedUsers.findByPk(order.dataValues.buyer.id, {
                include: [models.PurchaseOrders]
            });

            //If is a deleted user and this is the only order that has, delete the deleted user
            if(deletedUser.dataValues.PurchaseOrders.length <= 1) {
                deletedUser.destroy();
            }
        }

        order.destroy();
    }

    async setAsFinished(data) {
        const order = await this.findById(data.id);

        if(order.dataValues.finishedAt != null) throw boom.badRequest('The order is already set as finished');

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