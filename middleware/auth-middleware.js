const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {

    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
    
    if(!token){
        const error = new Error('Authentication failed');
        error.statusCode = 401;
        throw error;    
    }

    try{
        const decode = jwt.verify(token, 'super_secret_key');

        req.userId = decode._userId;

        next();
    }

    catch(error){
        error.statusCode = 500;
        throw error;
    }
}