const {body} = require ('express-validator');
const upload = require('../util/multer-cofig');
const isAuth = require('../middleware/auth-middleware');

const express = require('express');
const router =  express.Router();

const feedController = require('../controllers/feedController');  

router.get('/posts',isAuth,feedController.getPosts);

router.post('/posts', isAuth, upload.single('image'),
        [body('title').trim().isLength({ min:6}), body('content').isLength({ min: 5})], 
        feedController.createPost
);

router.get('/posts/:postId', isAuth, feedController.getPost);

router.put('/posts/:postId', isAuth,
        [body('title').trim().isLength({ min:6}), body('content').isLength({ min: 5})], 
        upload.single('image'), feedController.editPost
)

router.delete('/posts/:postId',isAuth, feedController.deletePost)
 
module.exports = router;