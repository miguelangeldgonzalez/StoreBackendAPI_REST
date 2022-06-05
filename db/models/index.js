const { User, UserSchema } = require('./user.model.js');
const { Products, ProductsSchema} = require('./Products.model');
const { OrderItems, OrderItemsSchema} = require('./orderItems.model');
const { PurchaseOrders, PurchaseOrdersSchema} = require('./purchaseOrders.model');


function SetupModels(sequelize){
    User.init(UserSchema, User.config(sequelize));
    Products.init(ProductsSchema, Products.config(sequelize));
    OrderItems.init(OrderItemsSchema, OrderItems.config(sequelize));
    PurchaseOrders.init(PurchaseOrdersSchema, PurchaseOrders.config(sequelize));

    User.associate(sequelize.models);
    Products.associate(sequelize.models);
    OrderItems.associate(sequelize.models);
    PurchaseOrders.associate(sequelize.models);
}

module.exports = SetupModels;