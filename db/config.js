const config = require('./../config/config.js');

module.exports = {
    development: {
        url: config.dbUrl,
        dialect: 'postgres' 
    },
    production: {
        url: config.dbUrl,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false
            }
        }
    }
}