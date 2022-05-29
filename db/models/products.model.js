const {Model, DataTypes, Sequelize} = require('sequelize');

const PRODUCTS_TABLE = 'products';

const ProductsSchema = {
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
        type: DataTypes.TEXT,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
        field: 'created_at'
    },
    discontinued: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}

class Products extends Model{
    static config(sequelize){
        return {
            sequelize,
            tableName: PRODUCTS_TABLE,
            modelName: 'Products',
            timestamps: false
        }
    }

    static associate(models){
        /*this.hasMany(models.OrderItems, {
            as: 'orders',
            foreignKey: 'productId'
        });*/
    }
}

module.exports = {Products, ProductsSchema, PRODUCTS_TABLE};