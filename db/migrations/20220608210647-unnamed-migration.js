const { SALES_TABLE, SalesSchema} = require('../models/sales.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(SALES_TABLE, SalesSchema);
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
