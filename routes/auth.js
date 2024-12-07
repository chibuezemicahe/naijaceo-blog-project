const express = require('express');
const router = express.Router();
const {body} = require ('express-validator');
const User = require('../models/user');
const authController = require('../controllers/auth')
const getDb = require('../util/database').getDb

router.put('/signup', 
    [
        body('email')
          .isEmail()
          .withMessage('Please enter a valid email.')
          .custom(async (value) => {
            
            const db = getDb();

            const userCollection = db.collection('users');

            const existingUser = await userCollection.findOne({ email:value})

            if (existingUser){
                return Promise.reject('This email address is already taken.');
            }
          }),
        body('password')
          .trim()
          .isLength({ min: 5 })
          .withMessage('Password must be at least 5 characters long.'),
        body('name').trim().notEmpty().withMessage('Name is required.'),
      ], authController.signup   
);

router.post('/login', authController.login);
module.exports = router;