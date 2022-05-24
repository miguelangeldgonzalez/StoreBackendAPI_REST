const { Sequelize } = require('sequelize');
const config = require('./../config/config.js');
const setupModels = require('./../db/models/index.js');

const options = {
    dialect: 'postgres',
    logging: false
}

const sequelize = new Sequelize(config.dbUrl, options);

setupModels(sequelize);

module.exports = sequelize;