const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Post, User, Image, Hashtag } = require('../models');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.followerCount = req.user ? req.user.Followers.length : 0;
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
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
router.get('/home', async (req, res, next) => {
    try {
        const posts = await Post.findAll({
            limit: 9,
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
        console.log(users);
        res.render('follow', {
            all_users: users,
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