const { Model, DataTypes } = require('sequelize');

const DELETED_PRODUCTS_TABLE = 'deleted_products';

const DeletedProductsSchema = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}

class DeletedProducts extends Model {
    static config(sequelize){
        return {
            sequelize,
            tableName: DELETED_PRODUCTS_TABLE,
            modelName: 'DeletedProducts',
            timestamps: false
        }
    }

    static associate(models){
        this.hasMany(models.Sales, {
            foreignKey: 'product_id',
            constraints: false
        })
    }
}

module.exports = { DeletedProducts, DeletedProductsSchema, DELETED_PRODUCTS_TABLE}