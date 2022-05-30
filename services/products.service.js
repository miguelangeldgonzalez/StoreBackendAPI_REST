const { models } = require('../libs/sequelize');

class Products{
    async findAll(){
        const rta = await models.Products.findAll();
        return rta;
    }

    async create(data){
        const rta = await models.Products.create(data);
        return rta;
    }

    async uploadPhotos(files){
        console.log(files);
    }
}

module.exports = Products;