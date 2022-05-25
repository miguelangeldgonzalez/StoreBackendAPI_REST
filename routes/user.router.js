const express = require('express');
const passport = require('passport');

const UserService = require('./../services/user.service.js');
const validatorHandler = require('./../middlewares/validator.handler.js');

const { uploadHandler } = require('../middlewares/upload.handler');
const { createUserSchema, getUserSchema, updateUserSchema } = require('../schemas/user.schema.js');

const router = express.Router();
const service = new UserService();

//Delete Profile Photo
router.get('/delete_profile_image', 
    passport.authenticate('jwt', {session: false}),
    async (req, res, next) => {
        try{
            const rta = await service.deleteProfilePhoto(req.user.sub);
            if (rta) res.status(200).json({ message: "Image deleted correctly" });
        } catch (error) {
            next(error);
        }
    }
)

const input = undefined;

//Load Profile Photo
router.post('/load_profile_image',
    passport.authenticate('jwt', {session: false}),
    async (req, res, next) => {
        input = req.body.uploadInput;
        next();
    },
    uploadHandler(input),
    async (req, res, next) => {
        try{
            const rta = await service.loadProfileImage(req.file, req.user.sub);
            res.status(201).json({ message: "Image loaded correctly" });
        } catch (error) {
            next(error)
        }
    }
)

//Create user
router.post('/', 
    validatorHandler(createUserSchema, 'body'),
    async (req, res, next) => {
        try{
            const data = req.body;
            const rta = await service.create(data);
            res.status(201).json(rta);
        } catch (error) {
            next(error);
        }
    }
)

//Get all users
router.get('/',
    passport.authenticate('jwt', {session: false}),
    async (req, res, next) => {
        try{
            const rta = await service.findAll();
            res.status(200).json(rta);
        } catch (error) {
            next(error);
        }
    }
)

//Get user by id
router.get('/:id',
    validatorHandler(getUserSchema, 'params'),
    async (req, res) => {
        const id = req.params.id;
        const rta = await service.findById(id);
        res.status(200).json(rta);
    }
);

//Edit user
router.patch('/:id',
    validatorHandler(getUserSchema, 'params'),
    validatorHandler(updateUserSchema, 'body'),
    async (req, res, next) => {
        try{
            const rta = await service.update(req.params.id, req.body);
            res.status(202).json(rta);
            return rta;
        }catch(error){
            next(error);
        }
    }
);

//Delete user
router.delete('/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
        const rta = await service.delete(req.params.id);
        res.status(202).json({
            message: "Deleted"
        })
    } catch(error){
        next(error);
    }
  }
);

module.exports = router;