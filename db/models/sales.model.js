const { Model, DataTypes } = require('sequelize');

const SALES_TABLE = 'sales';

const SalesSchesma = {
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
        
    }
}