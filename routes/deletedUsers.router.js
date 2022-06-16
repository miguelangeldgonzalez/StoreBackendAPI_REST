const express = require('express');
const passport = require('passport');

const { checkAdminRole } = require('../middlewares/auth.handler');
const DeletedUsers = require('../services/deletedUsers.service');

const service = new DeletedUsers;
const router = express.Router();

router.get('/', 
    passport.authenticate('jwt', {session: false}),
    checkAdminRole(),
    async (req, res, next) => {
        const rta = await service.findAll(req.query);
        res.json(rta)
    }
)

module.exports = router;