const { ValidationError } = require('sequelize');
const multer = require('multer');

function logErrors (err, req, res, next) {
  console.error(err);
  next(err);
}

function multerErrorHandler(err, req, res, next){
  if(err instanceof multer.MulterError){
    switch(err.code){
      case "LIMIT_FILE_SIZE":
        err.message = "Error: Image size is greater than 3MB";
    }

    delete err.name;
    res.status(406).json(err);
  }else{
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

function ormErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors
    });
  }
  next(err);
}


module.exports = { logErrors, errorHandler, boomErrorHandler, ormErrorHandler, multerErrorHandler }
