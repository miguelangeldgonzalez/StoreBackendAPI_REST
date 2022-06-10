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
        const id = !req.query.id ? req.user.sub : req.query.id;

        if (req.user.role != "admin") {
            if (req.query.id != req.user.sub) next(boom.forbidden('Only permited same or admin'));
            next();
        }else{
            next()
        }
    }
}

module.exports = { checkRoles, checkSameOrAdminRole, checkAdminRole };