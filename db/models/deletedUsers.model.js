const {Model, DataTypes} = require('sequelize');

const DELETED_USERS_TABLE = 'deleted_users';

const DeletedUsersSchema = {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    lastName: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'last_name'
    },
}

class DeletedUsers extends Model {
    static config(sequelize){
        return {
            sequelize,
            tableName: DELETED_USERS_TABLE,
            modelName: 'DeletedUsers',
            timestamps: false
        }
    }

    static associate(models){
        this.hasMany(models.PurchaseOrders, {
            foreignKey: 'buyerId',
            constraints: false
        })
    }
}

module.exports = { DELETED_USERS_TABLE, DeletedUsersSchema, DeletedUsers };