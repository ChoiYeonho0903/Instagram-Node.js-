const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Image, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

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

router.post('/img', isLoggedIn, upload.array('img', 5), (req, res) => {
  console.log(req.files);
  let urlArr = new Array(); 
  for (let i = 0; i < req.files.length; i++) { 
    urlArr.push(`/img/${req.files[i].filename}`); 
  } 
  let jsonUrl = JSON.stringify(urlArr); 
  res.json(jsonUrl);
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    console.log(req.body);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
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
      console.log(result);
      await post.addImages(result);
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

module.exports = router;