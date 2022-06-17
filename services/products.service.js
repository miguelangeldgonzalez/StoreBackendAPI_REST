const path = require('path');
const fs = require('fs-extra');
const boom = require('@hapi/boom');

const {Op} = require('sequelize');

const { models } = require('../libs/sequelize');

class Products{
    async findById(id){
        const product = await models.Products.findByPk(id);
        if(!product) throw boom.notFound('Product not found');
        return product;
    }

    searchProductImage(id) {
        const pathImage = path.resolve(`./public/products/${id}`);
        if(fs.pathExistsSync(pathImage)){
            return fs.readdirSync(pathImage).map(dir => {
                return path.resolve(`./public/${id}/${dir}`);
            });
        } else {
            return [];
        }
    }

    async findOne(id) {
        const product = await this.findById(id);

        product.dataValues.images = this.searchProductImage(id);
        return product.dataValues;
    }

    async findAll(query){
        let include = {};
        include.where = {
            stock: {
                [Op.gt]: 0
            }
        };

        if(query.id) include.where.id = query.id;

        if(query.name) include.where.name = {
            [Op.substring]: query.name
        }

        if(query.greater_than || query.less_than){
            include.order = [
                ['price', 'ASC']
            ]
            if(query.greater_than) include.where.price = {
                [Op.gte]: query.greater_than
            };
            if(query.less_than) include.where.price = {
                ...include.where.price,
                [Op.lte]: query.less_than
            };

        }

        if(query.offset) include.offset = query.offset;
        if(query.limit) include.limit = query.limit;

        const rta = await models.Products.findAll(include);
        return rta.map(product => {
            return {
                ...product.dataValues,
                images: this.searchProductImage(product.id)
            } 
        });
    }

    async create(data){
        const rta = await models.Products.create(data);
        return rta;
    }

    async update(id, changes){
        const product = await this.findById(id);
        const rta = await product.update(changes);

        return rta;
    }

    async delete(id){
        const product = await this.findById(id);
        if (!product) throw boom.notFound("There is not a product with that id");
        
        //If there are order items with the product, deleted it
        const items = await models.OrderItems.findAll({
            where: {
                productId: id
            },
        });

        let ordersUpdated = [];
        if(items.length > 0){
            ordersUpdated = await items.map(async item => {
                const orders = await models.PurchaseOrders.findAll({
                    include: [{
                        association: 'orderItems'
                    }],
                    where: {
                        id: item.dataValues.purchaseOrderId
                    }
                })
                
                return orders.map(order => {
                    const returned = {
                        buyerId: order.dataValues.buyerId,
                        createdAt: order.dataValues.createdAt
                    }
                    //If the order only have this product, delete the order too
                    if(order.dataValues.orderItems.length <= 1){
                        order.destroy()
                        returned.deleted = true;
                    } else {
                        //If the order has other products, only delete this product
                        item.destroy()
                        returned.deleted = false;
                    }

                    return returned;
                })
            });
        }

        const sales = await models.Sales.findOne({
            where: {
                productId: id
            }
        });

        //If there are a sale with the product, store the product as a deleted_product
        if (sales) await models.DeletedProducts.create({
            id,
            price: product.dataValues.price,
            name: product.dataValues.name,
            description: product.dataValues.description
        });

        //Delete product images
        fs.remove(path.resolve(`./public/products/${id}`));

        //Delete product
        product.destroy();

        return ordersUpdated;
    }

    async deleteImageProduct(id, images, deleteAll = false){
        await this.findById(id);
        const productDir = path.resolve("./public/products/" + id);

        if(fs.pathExistsSync(productDir)){
            if (deleteAll) {
                fs.removeSync(productDir);
            } else {
                images.forEach(image => {
                    fs.remove(`${productDir}\\${image}`);
                })
            }

        } else {
            throw boom.notFound("This product doesn't have images");
        }
    }
}


module.exports = Products;