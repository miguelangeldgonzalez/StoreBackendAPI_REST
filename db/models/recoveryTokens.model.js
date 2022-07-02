const {Model, DataTypes} = require('sequelize');

const RECOVERY_TOKENS_TABLE = 'recovery_tokens';

const RecoveryTokensSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
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
            modelName: 'RecoveryTokens',
            timestamps: false
        }
    }
}

module.exports = { RECOVERY_TOKENS_TABLE, RecoveryTokens, RecoveryTokensSchema }