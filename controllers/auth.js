const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const getDb = require('../util/database'); 
const jwt = require('jsonwebtoken');



exports.signup = (req,res,next)=>{
    console.log('Signup route hit');
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        const error = new Error('Validation Failed');
        error.statusCode = 422;
        error.data = errors.array();

        throw error;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const status =req.body.status;

    const saltRound = 10;
        
    bcrypt.hash(password, saltRound).then(hashePassword=>{

        const user = new User(
            email,
            hashePassword,
            name,
            status
        )

        return user.saveUser()

    }).then(result=>{
        res.status(201).json({
            message:'User Created',
            userId: result._id
        })
    }).catch(error=>{
        if (!error.statusCode) {
            error.statusCode = 500;
          }
          console.log(error.statusCode);
          next(error);
    })
}


exports.login = async (req,res,next)=>{
    const email = req.body.email;
    // const name = req.body.name;
    const password = req.body.password;

    try{
        const existingUser = await User.findUser(email);

        if(!existingUser){
            const error = new Error(' Email and Password Incorrect');
            error.statusCode = 401;
            throw error;
        }

        const passwordMatch =  await bcrypt.compare(password, existingUser.password);

        if (!passwordMatch) {
            const error = new Error('Incorrect Password');
            error.statusCode = 401;
            throw error;
        }
             
        const token = jwt.sign(
            { userId: existingUser._id.toString(), email: existingUser.email },
            'super_secret_key',  
            { expiresIn: '1h' } // Token expiration time
          );

          res.status(200).json({
            message: 'Login successful',
            token: token,
            userId:existingUser._id.toString()
          });
    }

    catch(error) {
        if (!error.statusCode) {
            error.statusCode = 500;
          }
          next(error);
    }

}