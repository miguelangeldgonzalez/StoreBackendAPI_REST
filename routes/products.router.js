const express = require('express');
const passport = require('passport');
const ProductsService = require('../services/products.service');

const { getProductSchema, 
        deleteImagesProduct, 
        editProductSchema,
        createProductSchema } = require('../schemas/products.schema');

const { checkAdminRole } = require('../middlewares/auth.handler');
const validatorHandler = require('../middlewares/validator.handler');
const { productUploadHandler } = require('../middlewares/upload.handler');

const router = express.Router();
const service = new ProductsService();

//Get all products
router.get('/',
    validatorHandler(getProductSchema, 'query'),
    async (req, res) => {
        const rta = await service.findAll(req.query);
        res.status(200).json(rta);
    }
);

//Create product
router.post('/',
    passport.authenticate('jwt', {session: false}),
    checkAdminRole(),
    validatorHandler(createProductSchema, 'body'),
    async (req, res) => {
        const rta = await service.create(req.body);
        res.status(201).json(rta);
    }
)

//Edit product
router.patch('/',
    passport.authenticate('jwt', {session: false}),
    checkAdminRole(),
    validatorHandler(editProductSchema, 'body'),
    async (req, res, next) => {
        try{
            const rta = await service.update(req.body.id, req.body);
            res.status(200).json(rta);
        } catch (error) {
            next(error);
        }
    }
)

//Delete Product
router.delete('/',
    passport.authenticate('jwt', {session: false}),
    checkAdminRole(),
    validatorHandler(getProductSchema, 'body'),
    async (req, res, next) => {
         try{
            const rta = await service.delete(req.body.id);
            res.status(200).json({
                message: "Product deleted"
            });
         } catch(error) {
             next(error)
         }
    }
)

//Load products photos
router.post('/upload_product_images', 
    passport.authenticate('jwt', {session: false}),
    checkAdminRole(),
    productUploadHandler()
);

//Delete products photos
router.delete('/delete_product_image',
    passport.authenticate('jwt', {session: false}),
    checkAdminRole(),
    validatorHandler(deleteImagesProduct, 'body'),
    async (req, res, next) => {
        try {
            await service.deleteImageProduct(req.body.id, req.body.images, req.body.deleteAll);
            res.status(200).json({
                message: "Images product deleted succesfuly"
            })
        } catch (error) {
            next(error);
        }
    }
)

module.exports = router;