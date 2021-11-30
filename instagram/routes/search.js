const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.get('/search/writer', isLoggedIn, async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            limit: 6,
            where: {},
            include: [
            {
                model: User,
                attributes: ['id', 'name'],
            }, {
                model: Image,
                attributes: ['img_url'],
            },
            {
                model: Hashtag,
                attributes: ['title'],
            }],
            order: [['createdAt', 'DESC']],
        });
        res.render('home', {
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/search/text', isLoggedIn, async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            limit: 6,
            where: {},
            include: [
            {
                model: User,
                attributes: ['id', 'name'],
            }, {
                model: Image,
                attributes: ['img_url'],
            },
            {
                model: Hashtag,
                attributes: ['title'],
            }],
            order: [['createdAt', 'DESC']],
        });
        res.render('home', {
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/search/hashtag', isLoggedIn, async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            limit: 6,
            where: {},
            include: [
            {
                model: User,
                attributes: ['id', 'name'],
            }, {
                model: Image,
                attributes: ['img_url'],
            },
            {
                model: Hashtag,
                attributes: ['title'],
            }],
            order: [['createdAt', 'DESC']],
        });
        res.render('home', {
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

module.exports = router;