const { Op } = require('sequelize');
const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

const PurchaseOrders = require('../services/purchaseOrders.service');

class Sales {
    async findAll(query){
        let where = {};

        if(query.id) where.id = query.id;
        if(query.productId) where.productId = query.productId;

        if(query.maxQuantity || query.minQuantity){
            where.quantity = {};

            if(query.maxQuantity) where.quantity[Op.lte] = query.maxQuantity;
            if(query.minQuantity) where.quantity[Op.gte] = query.minQuantity;
        }

        if(query.maxPrice || query.minPrice){
            where.price = {};

            if(query.maxPrice) where.price[Op.lte] = query.maxPrice;
            if(query.minPrice) where.price[Op.gte] = query.minPrice;
        }


        return await models.Sales.findAll({
            include: [
                models.Products, models.DeletedProducts, 
                {
                    association: 'purchaseOrder',
                    attributes: {
                        exclude: ['buyer_id']
                    }
                }
            ],
            attributes: ['id', 'price', 'quantity'],
            where
        });
    }

    async update(data) {
        const sell = await models.Sales.findByPk(data.id);
        if(!sell) throw boom.notFound("There is not a sell with that ID");
        return await sell.update(data);
    }

    async delete(id){
        const sell = await models.Sales.findByPk(id, {
            include: [
                models.Products, models.DeletedProducts, 
                {
                    association: 'purchaseOrder',
                    attributes: {
                        exclude: ['buyer_id']
                    }
                }
            ]
        });

        if (!sell) throw boom.notFound("There is not a sell with that id");
        
        //Verify if the product of the sale is a deleted product
        if(!sell.dataValues.product.dataValues.createdAt){
            const product = await models.DeletedProducts.findByPk(sell.dataValues.product.dataValues.id, {
                include: [models.Sales]
            });

            //If is a deleted product and, this is the unique sales that the product have, delete the deleted product
            if(product.dataValues.Sales.length <= 1) product.destroy();
        }

        const purchaseOrder = await models.PurchaseOrders.findByPk(sell.dataValues.purchaseOrderId);
        
        //Verify if the the order have another sales 
        if(purchaseOrder.dataValues.orderItems.length <= 1) {
            const service = new PurchaseOrders();

            //If doesn't have another sales, delete de order
            await service.deleteFinishedPurchaseOrder(purchaseOrder.dataValues.id);
        }

        sell.destroy();
    }

    async create(data){
        return await models.Sales.create(data);
    }
}

module.exports = Sales;