const {Model, DataTypes, Sequelize} = require('sequelize');
const {USER_TABLE} = require('../models/user.model');

const PURCHASE_ORDERS_TABLE = 'purchase_orders';

const PurchaseOrdersSchema = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    direction: {
        type: DataTypes.STRING,
        allowNull: false
    },
    buyerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'buyer_id',
        references: {
            model: USER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    orderedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
        field: 'ordered_at'
    },
    finishedAt: {
        type: DataTypes.DATE,
        defaultValue: undefined,
        allowNull: true,
        field: 'finished_at'
    }
}

class PurchaseOrders extends Model{
    static config(sequelize){
        return {
            sequelize,
            tableName: PURCHASE_ORDERS_TABLE,
            modelName: 'PurchaseOrders',
            timestamps: false
        }
    }

    static associate(models){
        this.belongsTo(models.User, {
            as: 'buyer', 
            sourceKey: 'buyerId'
        });

        this.hasMany(models.OrderItems, {
            as: 'orderItems', 
            foreignKey: 'purchaseOrderId'
        });
    }
}

module.exports = {PURCHASE_ORDERS_TABLE, PurchaseOrders, PurchaseOrdersSchema };