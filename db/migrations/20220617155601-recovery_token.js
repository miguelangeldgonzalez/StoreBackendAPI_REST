const { RECOVERY_TOKENS_TABLE, RecoveryTokensSchema } = require('../models/recoveryTokens.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(RECOVERY_TOKENS_TABLE, RecoveryTokensSchema);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(RECOVERY_TOKENS_TABLE);
  }
};
