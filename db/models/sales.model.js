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
        type: DataTypes.UUID,
        allowNull: false
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

    static association(models){

    }
}

module.exports = {SALES_TABLE, SalesSchesma, Sales}