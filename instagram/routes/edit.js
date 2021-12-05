const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { User, Hashtag, Image, Post } = require('../models');
const sequelize = require("sequelize");

const router = express.Router();

router.get('/', async (req, res, next) => {
    const postId = req.query.postId;
    try {
        const post = await Post.findOne({
            where: { id: postId },
        });
        res.render('edit', {
            twit : post,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;