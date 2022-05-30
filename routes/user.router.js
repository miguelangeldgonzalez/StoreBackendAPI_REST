const express = require('express');
const passport = require('passport');

const UserService = require('./../services/user.service.js');
const { uploadHandler } = require('../middlewares/upload.handler');
const validatorHandler = require('./../middlewares/validator.handler.js');
const { checkSameOrAdminRole } = require('../middlewares/auth.handler.js');

const { createUserSchema, getUserSchema, updateUserSchema } = require('../schemas/user.schema.js');

const router = express.Router();
const service = new UserService();

//Delete Profile Photo
router.get('/delete_profile_image', 
    passport.authenticate('jwt', {session: false}),
    checkSameOrAdminRole(),
    async (req, res, next) => {
        try{
            const rta = await service.deleteProfilePhoto(req.user.sub);
            if (rta) res.status(200).json({ message: "Image deleted correctly" });
        } catch (error) {
            next(error);
        }
    }
)

//Load Profile Photo
router.post('/upload_profile_image',
    passport.authenticate('jwt', {session: false}),
    uploadHandler(),
    async (req, res, next) => {
        try{
            const rta = await service.loadProfileImage(req.files[0], req.user.sub);
            if (rta) res.status(201).json({ message: "Image loaded correctly" });
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
    passport.authenticate('jwt', { session: false}),
    checkSameOrAdminRole(),
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
    passport.authenticate('jwt', {session: false}),
    checkSameOrAdminRole(),
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

//miranda:
//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEzLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2NTM0OTA0MjF9.eh3BTEXDfRU7SZoXS_rl3Hf0XDXNw353KFGw_xSW62g"
//cristina:
//"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NTM0OTA2ODV9.WLNANrknYHceYa2jciix0lqxm6Q4WSLB5NCcfMZGFw8"