const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { Post, User, Image, Hashtag } = require('../models');

const router = express.Router();

router.get('/', isLoggedIn ,async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name'],
        });
        res.render('msg', {
            allUsers: users,
        });
    } catch (err) {
        console.error(err);
        next(err);
    } 
});


module.exports = router;