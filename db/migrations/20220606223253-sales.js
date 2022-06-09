const { USER_TABLE, UserSchema } = require('../models/user.model');
const {SALES_TABLE, SalesSchema} = require('../models/sales.model');
const {PRODUCTS_TABLE, ProductsSchema} = require('../models/products.model');
const {ORDER_ITEMS_TABLE, OrderItemsSchema} = require('../models/orderItems.model');
const { DELETED_USERS_TABLE, DeletedUSersSchema } = require('../models/deletedUsers.model');
const {PURCHASE_ORDERS_TABLE, PurchaseOrdersSchema} = require('../models/purchaseOrders.model');
const {DELETED_PRODUCTS_TABLE, DeletedProductsSchema} = require('../models/deletedProducts.model');


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE, UserSchema);
    await queryInterface.createTable(PRODUCTS_TABLE, ProductsSchema);
    await queryInterface.createTable(PURCHASE_ORDERS_TABLE, PurchaseOrdersSchema);
    await queryInterface.createTable(SALES_TABLE, SalesSchema);
    await queryInterface.createTable(ORDER_ITEMS_TABLE, OrderItemsSchema);
    await queryInterface.createTable(DELETED_USERS_TABLE, DeletedUSersSchema);
    await queryInterface.createTable(DELETED_PRODUCTS_TABLE, DeletedProductsSchema);

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(SALES_TABLE);
    await queryInterface.dropTable(DELETED_PRODUCTS_TABLE);
    await queryInterface.dropTable(DELETED_USERS_TABLE);

  }
};
