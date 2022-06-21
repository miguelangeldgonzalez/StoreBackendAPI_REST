const path = require('path');
require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'dev',
    isProd: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET,
    temporalStorage: path.resolve('./../public/temp'), //Folter to store the temporal storage
    maxProductImage: process.env.MAX_PRODUCT_IMAGES || 10, //Max of product images
    userEmail: process.env.USER_EMAIL, //Email to send recovery mails
    userPass: process.env.USER_PASS //Password to send recovery mails
}

module.exports = config;