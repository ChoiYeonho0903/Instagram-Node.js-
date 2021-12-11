const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { User, Hashtag, Image, Post } = require('../models');
const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
    try {
        const search_type = req.body.search_type;
        const search_word = req.body.search_word;
        if (!search_word) {
            return res.redirect('/home');
        }

        if(search_type == "writer") {
            const writer = await User.findOne({ where: { name: {[Op.like]: `%${search_word}%`} }});
            let posts = [];
            if (writer) {
                posts = await writer.getPosts({
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name'],
                        }, {
                            model: Image,
                            attributes: ['img_url'],
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                });
            }
            if(posts.length==0) {
                res.locals.pageNum = 1;
            }
            else {
                if(posts.length%9==0) {
                    res.locals.pageNum = posts.length/9;
                }
                else {
                    res.locals.pageNum = parseInt(posts.length/9) + 1;
                }
            }
            return res.render('home', {
                twits: posts,
            });
        }
        else if (search_type == "text") {
            const text = search_word;
            let posts = [];
            if (text) {
                posts = await Post.findAll({
                    where: {
                        content: {
                            [Op.like]: `%${text}%`}},
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name'],
                        }, {
                            model: Image,
                            attributes: ['img_url'],
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                });
            }
            if(posts.length==0) {
                res.locals.pageNum = 1;
            }
            else {
                if(posts.length%9==0) {
                    res.locals.pageNum = posts.length/9;
                }
                else {
                    res.locals.pageNum = parseInt(posts.length/9) + 1;
                }
            }
            return res.render('home', {
                twits: posts,
            });
        }
        else if (search_type == "hashtag") {
            const hashtag = await Hashtag.findOne({ where: { title: { [Op.like]: `%${search_word}%`} }});
            let posts = [];
            if (hashtag) {
                posts = await hashtag.getPosts({
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'name'],
                        }, {
                            model: Image,
                            attributes: ['img_url'],
                        },
                    ],
                    order: [['createdAt', 'DESC']],
                });
            }
            if(posts.length==0) {
                res.locals.pageNum = 1;
            }
            else {
                if(posts.length%9==0) {
                    res.locals.pageNum = posts.length/9;
                }
                else {
                    res.locals.pageNum = parseInt(posts.length/9) + 1;
                }
            }
            return res.render('home', {
                twits: posts,
            });
        }
        else {
            return res.redirect('/home');
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/username', isLoggedIn, async (req, res, next) => {
    try {
        const writer = await User.findOne({ where: { name: req.query.writer }});
        let posts = [];
        if (writer) {
            posts = await writer.getPosts({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name'],
                    }, {
                        model: Image,
                        attributes: ['img_url'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        }
        if(posts.length==0) {
            res.locals.pageNum = 1;
        }
        else {
            if(posts.length%9==0) {
                res.locals.pageNum = posts.length/9;
            }
            else {
                res.locals.pageNum = parseInt(posts.length/9) + 1;
            }
        }
        return res.render('home', {
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

router.get('/hashtag', isLoggedIn, async (req, res, next) => {
    try {
        const hashtag = await Hashtag.findOne({ where: { title: req.query.hashtag },});
        let posts = [];
        if (hashtag) {
            posts = await hashtag.getPosts({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'name'],
                    }, {
                        model: Image,
                        attributes: ['img_url'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        }
        if(posts.length==0) {
            res.locals.pageNum = 1;
        }
        else {
            if(posts.length%9==0) {
                res.locals.pageNum = posts.length/9;
            }
            else {
                res.locals.pageNum = parseInt(posts.length/9) + 1;
            }
        }
        return res.render('home', {
            twits: posts,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;