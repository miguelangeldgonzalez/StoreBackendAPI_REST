const {PURCHASE_ORDERS_TABLE, PurchaseOrdersSchema} = require('../models/purchaseOrders.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(PURCHASE_ORDERS_TABLE, 'buyer_id', PurchaseOrdersSchema.buyerId);
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
