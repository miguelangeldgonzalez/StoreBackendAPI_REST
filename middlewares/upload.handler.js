const formidable = require('formidable');
const boom = require('@hapi/boom');
const multer = require('multer');
const fs = require('fs-extra');
const path = require('path');

const { getProductSchema } = require('../schemas/products.schema');

const ProductsService = require('../services/products.service');
const service = new ProductsService();

const {maxProductImage, temporalStorage} =  require('../config/config');

const imageTypes = ['jpeg', 'jpg', 'png', 'gif'];

const storage = route => multer.diskStorage({
    destination: route,
    filename: async (req, file, cb) => {
        cb(null, file.originalname)
    }
});

function productUploadHandler(){
    const upload = req => new Promise((resolve, reject) => {
        formidable({ 
            multiples: true
        }).parse(req, async (err, fields, files) => {
            const { error } = getProductSchema.validate(fields);
            if (error) {
                reject(boom.badRequest(error));
                return;
            } 

            if(files[fields.field] == undefined) {
                reject(boom.badRequest('Field not found'));
                return;
            }

            try{
                await service.findById(fields.id);
            }catch (error){
                reject(boom.badRequest('There is not a product with that ID'));
                return;
            }

            const destination = path.resolve(`./public/products/${fields.id}/`);
            fs.ensureDirSync(destination);
            const uploadedProductImages = await fs.readdir(destination);

            if(uploadedProductImages.length >= 10) {
                reject(boom.badRequest(`This product exceeds the number of images allowed. Number of images allowed per product is ${maxProductImage}`));
                return;
            }

            if (files[fields.field].length != undefined) {
                let images = files[fields.field];
                images.splice(maxProductImage - uploadedProductImages.length, images.length);

                let uploadedImages = images.map(image => {
                    let ext = image.mimetype.split('/')[1];

                    if(imageTypes.includes(ext)){
                        let finalName = Math.floor(Math.random() * 200) + "." + ext;
                        let dest = destination + "\\" + finalName;

                        try{ fs.move(image.filepath, dest); } catch (e) {}
                        return dest;
                    }
                });

                resolve(uploadedImages);
            } else {
                 reject(boom.badRequest('There are not file uploaded'));
            }
        });
    })
    return async (req, res, next) => {
        try{
            const rta = await upload(req)
            res.status(201).json(rta);
        }catch (error) {
            next(error);
        }
        

    };
}

function uploadHandler(){
    return multer({
        storage: storage(temporalStorage),
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
            fileSize: 3000000,
            files: maxProductImage
        }
    }).any();
}

module.exports = { uploadHandler, productUploadHandler };