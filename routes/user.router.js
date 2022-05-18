import express from 'express';

import validatorHandler from './../middlewares/validator.handler.js';
import { createUserSchema } from '../schemas/user.schema.js';

const router = express.Router();

// Create user
router.post('/', 
    validatorHandler(createUserSchema, 'body'),
    async (req, res, next) => {
        res.json(req.body);
    }
)

//Edit user
router.patch('/:id',
    validatorHandler(),
    async (req, res, next) => {
        
    }
) 
export default router;