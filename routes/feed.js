const {body} = require ('express-validator');
const upload = require('../util/multer-cofig');

const express = require('express');
const router =  express.Router();

const feedController = require('../controllers/feedController');  

router.get('/posts', feedController.getPosts);

router.post('/posts',  upload.single('image'),
        [body('title').trim().isLength({ min:6}), body('content').isLength({ min: 5})], 
        feedController.createPost
);

router.get('/posts/:postId', feedController.getPost);

router.put('/posts/:postId', 
        [body('title').trim().isLength({ min:6}), body('content').isLength({ min: 5})], 
        upload.single('image'), feedController.editPost
)

router.delete('/posts/:postId',feedController.deletePost)
 
module.exports = router;