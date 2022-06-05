const boom = require('@hapi/boom');

function checkAdminRole(){
    return (req, res, next) => {
        const user = req.user;
        if(user.role === "admin"){
            next();
        }else{
            next(boom.forbidden());
        }
    }
}

function checkRoles(...roles){
    return (req, res, next) => {
        if(roles.includes(req.user.role)) {
            next();
        } else {
            next(boom.forbidden());
        }
    }
}

function checkSameOrAdminRole() {
    return (req, res, next) => {
        const user = req.user;

        if(user.role === "admin" || user.sub == req.params.id){
            next();
        }else{
            next(boom.forbidden());
        }
    }
}

module.exports = { checkRoles, checkSameOrAdminRole, checkAdminRole };