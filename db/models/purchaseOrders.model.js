const {Model, DataTypes, Sequelize} = require('sequelize');

const polymorphic = require('../polymorphic');

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
        type: DataTypes.UUID,
        field: 'buyer_id',
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
        const options = {
            foreignKey: 'buyerId',
            constraints: false
        };

        this.belongsTo(models.User, options);
        this.belongsTo(models.DeletedUsers, options);

        this.addHook('afterFind', findResult => polymorphic(findResult, 'User', 'DeletedUser', 'buyer'));

        this.hasMany(models.OrderItems, {
            as: 'orderItems', 
            foreignKey: 'purchaseOrderId'
        });

        this.addHook('afterFind', async findResult => {
            if(findResult){
                if(!Array.isArray(findResult)) findResult = [findResult];
                for (const instance of findResult) {
                    if (instance.dataValues.finishedAt != null){
                        let sales = await models.Sales.findAll({
                            where: {
                                purchaseOrderId: instance.dataValues.id
                            },
                            include: [models.Products, models.DeletedProducts],
                            attributes: ['price', 'quantity']
                        });

                        instance.dataValues.orderItems = sales;
                    }
                }
            }
        });
    }
}

module.exports = {PURCHASE_ORDERS_TABLE, PurchaseOrders, PurchaseOrdersSchema };