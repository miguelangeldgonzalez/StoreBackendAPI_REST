const {ORDER_ITEMS_TABLE, OrderItemsSchema} = require('../models/orderItems.model');

module.exports = {
  async up (queryInterface, Sequelize) {
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
