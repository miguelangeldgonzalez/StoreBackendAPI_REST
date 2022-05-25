const boom = require('@hapi/boom');
const multer = require('multer');
const path = require('path');

function uploadHandler(input){
    const storage = route => multer.diskStorage({
        destination: path.join(__dirname, route),
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    });

    return multer({
        storage: storage('./../public/temp'),
        fileFilter: (req, file, cb) => {
            var filetypes = /jpeg|jpg|png|gif/;
            var mimetype = filetypes.test(file.mimetype);
            var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

            if (mimetype && extname) {
                cb(null, true);
            } else {
                cb(boom.unsupportedMediaType("Error: Image upload, only supports the following filetypes - " + filetypes), false);
            }
        },
        limits: {
            fileSize: 3000000
        }
    }).single(input || 'archivo');
}

module.exports = { uploadHandler }