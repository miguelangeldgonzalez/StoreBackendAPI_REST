const path = require('path');
const fs = require('fs-extra');
const boom = require('@hapi/boom');
const { maxProductImage } = require('../config/config');

const { models } = require('../libs/sequelize');

class Products{
    async findById(id){
        const product = await models.Products.findByPk(id);
        if(!product) throw boom.badData('There is not a produt with that id');
        return product.dataValues;
    }
    async findAll(){
        const rta = await models.Products.findAll();
        return rta;
    }

    async create(data){
        const rta = await models.Products.create(data);
        return rta;
    }

    async uploadPhotos(files, id){
        const productPath = path.resolve(`./public/products/${id}`);

        await fs.ensureDir(productPath);
        const uploadedProductImages = await fs.readdir(productPath);
        const imagesCanUpload = maxProductImage - uploadedProductImages.length;

        for(let i = 0; i < files.length; i++){
            if(i < imagesCanUpload){
                fs.move(files[i].path, productPath);
            }else{
                fs.remove(file.path);
            }
        }
    }
}


module.exports = Products;