const {Model, DataTypes} = require('sequelize');
const {PURCHASE_ORDERS_TABLE} = require('./purchaseOrders.model');
const {PRODUCTS_TABLE} = require('./products.model');

const ORDER_ITEMS_TABLE = 'order_items';

const OrderItemsSchema = {
    purchaseOrderId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'purchase_order_id',
        references: {
            model: PURCHASE_ORDERS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'product_id',
        references: {
            model: PRODUCTS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    }
}

class OrderItems extends Model{
    static config(sequelize){
        return {
            sequelize,
            tableName: ORDER_ITEMS_TABLE,
            modelName: 'OrderItems',
            timestamps: false
        }
    }

    static associate(models){
        this.belongsTo(models.PurchaseOrders, {
            as: 'purchaseOrder',
            sourceKey: 'purchaseOrderId'
        });

        this.hasOne(models.Products, {
            as: 'products',
            sourceKey: 'productId',
            foreignKey: 'id'
        })
    }
}

module.exports = {OrderItems, OrderItemsSchema, ORDER_ITEMS_TABLE}