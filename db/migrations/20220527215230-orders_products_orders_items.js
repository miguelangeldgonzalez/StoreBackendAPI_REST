const {PRODUCTS_TABLE, ProductsSchema} = require('../models/products.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(PRODUCTS_TABLE, ProductsSchema);
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
