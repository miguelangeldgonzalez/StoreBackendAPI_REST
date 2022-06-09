const express = require('express');
const passport =  require('passport');

const SalesService = require('../services/sales.service');
const service = new SalesService();

const router = express.Router();

router.get('/', 
    async (req, res, next) => {
        const rta = await service.findAll();
        res.json(rta);
    }
);

module.exports = router;