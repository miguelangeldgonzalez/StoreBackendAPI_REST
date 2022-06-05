const path = require('path');
const fs = require('fs-extra');
const boom = require('@hapi/boom');

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

    async findAll(){
        const rta = await models.Products.findAll();
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
        let product = await this.findById(id);
        product = await product.update({discontinued: true, stock: 0});

        const orderItems = await models.OrderItems.findAll({
            where: {
                "product_id": id
            }
        });

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