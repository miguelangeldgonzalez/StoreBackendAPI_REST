const path = require('path');
const fs = require('fs-extra');
const boom = require('@hapi/boom');
const { maxProductImage } = require('../config/config');

const { models } = require('../libs/sequelize');

class Products{
    async findById(id){
        const product = await models.Products.findOne({
            where: {
                id, 
                discontinued: false
            }
        });
        if(!product) throw boom.notFound('Product not found');
        return product;
    }

    async findAll(){
        const rta = await models.Products.findAll({
            where: {
                discontinued: false
            }
        });
        return rta;
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
        let product = await this.findById(id);
        product = await product.update({discontinued: true, stock: 0});

        const orderItems = await models.OrderItems.findAll({
            where: {
                "product_id": id
            }
        });
        console.log(orderItems);
        if(orderItems.length > 0) orderItems.forEach(item => item.destroy());

        fs.remove(path.resolve(`./public/products/${id}`));
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