const {PURCHASE_ORDERS_TABLE, PurchaseOrdersSchema} = require('../models/purchaseOrders.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable(PURCHASE_ORDERS_TABLE, PurchaseOrdersSchema)
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable(PURCHASE_ORDERS_TABLE);
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
