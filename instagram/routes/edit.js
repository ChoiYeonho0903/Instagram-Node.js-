const express = require('express');
const { isLoggedIn } = require('./middlewares');
const { User, Hashtag, Image, Post } = require('../models');
const sequelize = require("sequelize");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.array('img', 5), async (req, res) => {
  let urlArr = new Array(); 
  for (let i = 0; i < req.files.length; i++) { 
    urlArr.push(`/img/${req.files[i].filename}`); 
  } 
  let jsonUrl = JSON.stringify(urlArr); 
  res.json(jsonUrl);
});

const upload2 = multer();
router.post('/update', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    const postId = req.body.twitId;
    const post = await Post.findOne({ 
      where: { id: postId }, 
      include: [
        {
            model: Image,
            attributes: ['img_url'],
        }],
    });
    for(let i = 0; i < post.Images.length; i++) {
        let img_url = post.Images[i].img_url.replace('/img', 'uploads');
        fs.unlink(img_url, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            else {
              console.log("성공");
            }
        });
    } 
    await Image.destroy({
      where: { postId: postId },
    });
    await Post.update({
      content: req.body.content,
    }, {
      where: { id: postId }
    });
    
    const images = req.body.url;
    if(images) {
      const result = await Promise.all(
        images.map((url) => {
          return Image.create({
            img_url: url,
          });
        }),
      );
      await post.setImages(result);
    }
    
    const hashtags = req.body.content.match(/#[^\s#]*/g); //정규표현식 사용해서 hashtag 얻기
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/home');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:id/delete', async (req, res, next) => {
    const postId = req.params.id;
    try {
        const post = await Post.findOne({ 
          where: { id: postId }, 
          include: [
            {
                model: Image,
                attributes: ['img_url'],
            }],
        });
        for(let i = 0; i < post.Images.length; i++) {
            let img_url = post.Images[i].img_url.replace('/img', 'uploads');
            fs.unlink(img_url, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                else {
                  console.log("성공");
                }
            });
        }
        await Post.destroy({
          where: { id: postId },
        });
        res.redirect('/home');
    } catch (error) {
      console.error(error);
      next(error);
    }
});

router.get('/', async (req, res, next) => {
    const postId = req.query.postId;
    const writerId = req.query.writerId;
    try {
        const post = await Post.findOne({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name'],
                }, {
                    model: Image,
                    attributes: ['img_url'],
                }],
            where: { id: postId },
            order: [['createdAt', 'DESC']],
        });
        if (post.UserId != writerId ) {
            return res.redirect('/home?error=exist');
        }
        else {
            res.render('edit', {
                twit : post,
            });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;