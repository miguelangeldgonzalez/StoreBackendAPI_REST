const { User, UserSchema } = require('./user.model.js');
const { Sales, SalesSchema } = require('./sales.model'); 
const { Products, ProductsSchema } = require('./Products.model');
const { OrderItems, OrderItemsSchema } = require('./orderItems.model');
const { DeletedUsers, DeletedUsersSchema } = require('./deletedUsers.model');
const { RecoveryTokens, RecoveryTokensSchema } = require('./recoveryTokens.model');
const { PurchaseOrders, PurchaseOrdersSchema } = require('./purchaseOrders.model');
const { DeletedProducts, DeletedProductsSchema } = require('./deletedProducts.model');

function SetupModels(sequelize){
    User.init(UserSchema, User.config(sequelize));
    Sales.init(SalesSchema, Sales.config(sequelize));
    Products.init(ProductsSchema, Products.config(sequelize));
    OrderItems.init(OrderItemsSchema, OrderItems.config(sequelize));
    DeletedUsers.init(DeletedUsersSchema, DeletedUsers.config(sequelize));
    RecoveryTokens.init(RecoveryTokensSchema, RecoveryTokens.config(sequelize));
    PurchaseOrders.init(PurchaseOrdersSchema, PurchaseOrders.config(sequelize));
    DeletedProducts.init(DeletedProductsSchema, DeletedProducts.config(sequelize));

    User.associate(sequelize.models);
    Sales.associate(sequelize.models);
    Products.associate(sequelize.models);
    OrderItems.associate(sequelize.models);
    DeletedUsers.associate(sequelize.models);
    PurchaseOrders.associate(sequelize.models);
    DeletedProducts.associate(sequelize.models);
}

module.exports = SetupModels;