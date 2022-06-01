const express = require('express');
const ProductsService = require('../services/products.service');

const { productUploadHandler } = require('../middlewares/upload.handler');

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
    async (req, res) => {
        const rta = await service.create(req.body);
        res.status(201).json(rta);
    }
)

//Load profile photos
router.post('/upload_product_images', productUploadHandler())

module.exports = router;