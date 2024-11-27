const {validationResult} = require('express-validator');
const Post = require('../models/post');
const cloudinary = require('../util/cloudinaryconfig');
const { ObjectId } = require('mongodb');

exports.getPosts = (req,res, next)=>{
    const currentPage = parseInt(req.query.page || 1);
    const noPerPage = 2;
    let totalItems;


    Post.fetchAll().then(posts=>{
        if(!posts){
            const error = new Error('No Post Have Been Made');
            error.statusCode = 500;
            throw error;
        }

        totalItems = posts.length;
        
        return Post.fetchAll();
    }).then(post=>{
        // Here i extract the number of post i want to get from the backend per page and render to the frontEnd.
        const pagination = post.slice((currentPage-1)*2, currentPage*noPerPage);

      return  res.status(200).json({
            message:'All Post fetched Successfully',
            posts:pagination,
            totalItems:totalItems
        })
    }).catch(error=>{
        console.log(error);
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error); 
    })   
};

exports.createPost = (req, res, next ) => {
    const error = validationResult(req); 
    if (!error.isEmpty()){
        const error = new Error('Server side Validation Failed');
        
        // Here I handle the error that is being thrown if serverside validation for creating post fails
        error.statusCode = 422;
        throw error;
    }

    
    
    const title = req.body.title;
    const content = req.body.content;

 

    if (!req.file) {  // Check if req.file exists
        const error = new Error('No file uploaded');
        error.statusCode = 400;  // Bad request
        throw error;
    }
    const imageUrl = req.file.path;

//    console.log(imageUrl)

    const uploadImage = async (imagePath) => {

        
        // Use the uploaded file's name as the asset's public ID and 
        // allow overwriting the asset with new versions
        const options = {
          use_filename: true,
          unique_filename: false,
          overwrite: true,
          folder:'reactApp_blog_images'
        };
    
        try {
          // Upload the image
          const result = await cloudinary.uploader.upload(imagePath, options);
          return result.secure_url;
        } catch (error) {
          console.error(error);
          throw new Error('Cloudinary upload failed');
        }
    
    };


    // create Post in db
    uploadImage(imageUrl).then((secureUrl) => {
        const post = new Post(
            title,
            content,
            secureUrl,
            { name: 'Micah' },
            new Date().toISOString()
        );

        post.savePost().then((result) => {
            console.log(result);
            res.status(200).json({
                message: 'Post created successfully',
                post: {
                    ...result,    
                    createdAt: new Date(result.createdAt).toISOString()             }
            });
        }).catch(next);  // Simplified error handling
    }).catch(next);  // If uploadImage fails, handle the error here
};

exports.getPost = (req,res,next)=>{
    const postId = req.params.postId;
    Post.findById(postId).then(post=>{
        if (!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message:'Single Post Fetched Successfully',
            post:post
        })
    
    }).catch(error=>{
        console.log(error);
        if(!error.statusCode){
            error.statusCode = 500;
        }
    });
}

exports.editPost = async (req,res,next)=>{
    const error = validationResult(req);

    if(!error.isEmpty()){
        const error = new Error('Something wrong, Server side validation failed')
            // Here I handle the error that is being thrown if serverside validation for creating post fails
         error.statusCode = 422;
        throw error;
    }
    
    const postId = req.params.postId;
    
    // Here i deconstruct the edited and inputed details in the form
    const {title, content} = req.body;

    // Here below i extract the form url;
    const imageUrl = req.file ? req.file.path : null;

    try {
        const postDoc = await Post.findById(postId);
        if (!postDoc) {
            const error = new Error('No post found in the database');
            error.statusCode = 404;
            throw error;
        }

         // Convert the plain object to a FeedPost instance, including the _id
        const post = new Post(
            postDoc.title,
            postDoc.content,
            postDoc.imageUrl,
            postDoc.creator,
            postDoc.createdAt
        );
        post._id = postDoc._id;
        // Update fields in the existing post
        post.title = title || postDoc.title;
        post.content = content || postDoc.content;
    
        if (imageUrl) {
            const result = await cloudinary.uploader.upload(imageUrl, {
                folder: 'reactApp_blog_images',
                use_filename: true,
                unique_filename: false,
                overwrite: true,
            });
            post.imageUrl = result.secure_url || postDoc.imageUrl;
    
            // Clean up old image if necessary
            cloudinary.uploader.destroy(result.public_id);
        }
    
        await post.savePost(); // Save changes to the existing document
        res.status(200).json({ message: 'Post updated successfully', post: postDoc });
    } 
    catch (error) {
        next(error);
    } 
}

exports.deletePost = async (req,res,next)=>{
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    
    try{

        if(!post){
            const error = new Error('Post Not Found For Deletion');
            error.statusCode = 404
            throw error;
        }

        await Post.deletePost(postId);

        res.status(200).json({
            message: 'Post deleted successfully',
            postId: postId,
        });


    }catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }

        next(error);
    }
    
}