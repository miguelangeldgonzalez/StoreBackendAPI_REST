const { User, UserSchema } = require('./user.model.js');

function SetupModels(sequelize){
    User.init(UserSchema, User.config(sequelize));
}

module.exports = SetupModels;