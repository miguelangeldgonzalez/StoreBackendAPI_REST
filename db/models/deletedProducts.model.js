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
    productId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    productDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}

class DeletedProducts extends Model {
    static config(sequelize){
        return {
            sequelize,
            tableName: DELETED_PRODUCTS_TABLE,
            modelName: 'DeletedProduct',
            timestamps: false
        }
    }

    static association(models){
        this.hasMany(models.Sales, {

        })
    }
}

module.exports = { DeletedProducts, DeletedProductsSchema, DELETED_PRODUCTS_TABLE}