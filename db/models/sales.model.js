const { Model, DataTypes } = require('sequelize');
const { PURCHASE_ORDERS_TABLE } = require('./purchaseOrders.model');

const polymorphic = require('../polymorphic');

const SALES_TABLE = 'sales';

const SalesSchema = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'product_id'
    },
    purchaseOrderId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'purchase_order_id',
        references: {
            model: PURCHASE_ORDERS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}

class Sales extends Model {
    static config(sequelize){
        return {
            sequelize,
            tableName: SALES_TABLE,
            modelName: 'Sales',
            timestamps: false
        }
    }

    static associate(models){
        const options = {
            foreignKey: 'product_id',
            constraints: false
        };

        this.belongsTo(models.Products, options);
        this.belongsTo(models.DeletedProducts, options);

        this.addHook('afterFind', findResult => polymorphic(findResult, 'Product', 'DeletedProduct', 'product'));

        this.belongsTo(models.PurchaseOrders, {
            foreignKey: 'purchaseOrderId'
        })
    }
}

module.exports = {SALES_TABLE, SalesSchema, Sales}