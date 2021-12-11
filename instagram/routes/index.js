const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Image, Hashtag } = require('../models');

const router = express.Router();

router.use(async (req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
    res.locals.followingIdList = req.user ? req.user.Followers.map(f => f.id) : [];
    const posts = await Post.findAll({});
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
    next();
});

router.get('/', (req, res, next) => {
    res.render('login', {});
});
router.get('/account', isNotLoggedIn, (req, res, next) => {
    res.render('account', {});
});

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('profile', {});
});

router.get('/home/:pagenum/', isLoggedIn, async (req, res, next) => {
    try {
        let pageNum = req.params.pagenum;
        let offset = 0;
        if(pageNum > 1) {
            offset = 9 * (pageNum -1);
        }
        const posts = await Post.findAll({
            limit: 9,
            offset: offset,
            include: [
            {
                model: User,
                attributes: ['id', 'name'],
            }, {
                model: Image,
                attributes: ['img_url'],
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
router.get('/home', isLoggedIn,async (req, res, next) => {
    try {
        let pageNum = 1;
        let offset = 0;
        if(pageNum > 1) {
            offset = 9 * (pageNum -1);
        }
        const posts = await Post.findAll({
            
            limit: 9,
            offset: offset,
            include: [
            {
                model: User,
                attributes: ['id', 'name'],
            }, {
                model: Image,
                attributes: ['img_url'],
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

router.get('/new', isLoggedIn, (req, res, next) => {
    res.render('new', {});
});

router.get('/follow', isLoggedIn, async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name'],
        });
        res.render('follow', {
            allUsers: users,
        });
    } catch (err) {
        console.error(err);
        next(err);
    } 
});

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('profile', {});
});


module.exports = router;