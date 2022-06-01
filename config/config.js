const path = require('path');
require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    isProd: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    temporalStorage: path.resolve('./../public/temp'), //Folter to store the temporal storage
    maxProductImage: 10 //Max of product images
}

module.exports = config;