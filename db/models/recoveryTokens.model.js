const {Model, DataTypes} = require('sequelize');

const RECOVERY_TOKENS_TABLE = 'recovery_token';

const RecoveryTokensSchema = {
    token: {
        allowNull: true,
        type: DataTypes.STRING
    }
}

class RecoveryTokens extends Model {
    static config(sequelize){
        return {
            sequelize,
            tableName: 'recovery_tokens',
            modelName: 'RecoveryTokens'
        }
    }
}

module.exports = { RECOVERY_TOKENS_TABLE, RecoveryTokens, RecoveryTokensSchema }