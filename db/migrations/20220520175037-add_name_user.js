const {USER_TABLE, UserSchema} = require('./../models/user.model.js');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(USER_TABLE, 'name', UserSchema.name);
    await queryInterface.addColumn(USER_TABLE, 'last_name', UserSchema.lastName);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(USER_TABLE, 'name');
    await queryInterface.removeColumn(USER_TABLE, 'last_name');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
