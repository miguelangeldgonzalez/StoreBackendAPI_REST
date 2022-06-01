const express = require('express');
const ProductsService = require('../services/products.service');

const { getProductSchema, 
        deleteImagesProduct, 
        editProductSchema,
        createProductSchema } = require('../schemas/products.schema');

const { productUploadHandler } = require('../middlewares/upload.handler');
const validatorHandler = require('../middlewares/validator.handler');

const router = express.Router();
const service = new ProductsService();

//Get all products
router.get('/',
    async (req, res) => {
        const rta = await service.findAll();
        res.status(200).json(rta);
    }
);

//Create product
router.post('/',
    validatorHandler(createProductSchema, 'body'),
    async (req, res) => {
        const rta = await service.create(req.body);
        res.status(201).json(rta);
    }
)

//Edit product
router.patch('/',
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

router.delete('/', 
    validatorHandler(getProductSchema, 'body'),
    async (req, res, next) => {
         try{
            const rta = await service.delete(req.body.id);
            res.status(200).json(rta);
         } catch(error) {
             next(error)
         }
    }
)

//Load products photos
router.post('/upload_product_images', productUploadHandler());

//Delete products photos
router.delete('/delete_product_image',
    validatorHandler(deleteImagesProduct, 'body'),
    async (req, res, next) => {
        try {
            await service.deleteImageProduct(req.body.id, req.body.images, req.body.deleteAll);
            res.status(200).json({
                message: "Image product deleted succesfuly"
            })
        } catch (error) {
            next(error);
        }
    }
)

module.exports = router;