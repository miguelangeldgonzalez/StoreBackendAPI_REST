const {ORDER_ITEMS_TABLE, OrderItemsSchema} = require('../models/orderItems.model');
const {PURCHASE_ORDERS_TABLE, PurchaseOrdersSchema} = require('../models/purchaseOrders.model');
const {PRODUCTS_TABLE, ProductsSchema} = require('../models/products.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(PRODUCTS_TABLE, ProductsSchema);
    await queryInterface.createTable(PURCHASE_ORDERS_TABLE, PurchaseOrdersSchema);
    await queryInterface.createTable(ORDER_ITEMS_TABLE, OrderItemsSchema);
    
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
