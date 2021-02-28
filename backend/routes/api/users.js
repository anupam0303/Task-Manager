const express = require('express');
const multer = require('multer');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const fs = require('fs');

const config = require('../../config/configs');
const messages = require('../../config/messages');
const logger = require('../../utilities/logger');
const auth = require ('../../tokenHandler/auth');
// User Model
const user = require('../../models/user');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(request, file, cb){
        var dir = './uploads/'+ new Date().toISOString().substring(0,10);
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        cb(null, './uploads/'+ new Date().toISOString().substring(0,10) + '/')
    },
    filename: function(request, file, cb){
        cb(null, file.originalname)
    }
});

const fileFilter = (request, file, cb) => {
    // Save a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ||file.mimetype === 'image/jpg'){
        cb(null, true);
    }
    // Reject a file
    else {
        cb(new Error('Allowed file types are jpeg, jpg and png'), false);
    }  
}

const upload = multer({storage: storage, 
    limits: {
        fileSize: 1024*1024*10
    },
    fileFilter: fileFilter
});

/*********************************************/
// @route GET api/users/:email
// @desc Gets user from email
// @access Private
/*********************************************/
router.get('/search', auth, (request, response) => {
    if(typeof request.query.email != 'undefined'){
        user.find({email: request.query.email})
        .select('-password')
        .then(user => {
            if(user.length==0){
                response.status(404).json({success: false, msg: messages.USER_NOT_FOUND});
            }
            else {
                response.json(user);
            }
            
        })
        .catch(error => response.status(500).json({ success: false, msg: error }))
    }
    else{
        response.status(400).json({ success: false, msg: messages.USER_INVALID_SEARCH_CRITERIA })
    }
    
});

/*********************************************/
// @route POST api/users
// @desc Register a new user
// @access Public
/*********************************************/
router.post('/', upload.single('userImage'),(request, response) => {
    const {firstName, lastName, email, password} = request.body;
    // Validations
    if(!firstName || !email || !password) {
        return response.status(400).json({success: false, msg: messages.USER_CREATE_BAD_REQUEST});
    }
    // Check for existing user
    user.findOne({email})
        .then(user=> {
            if(user){
                return response.status(400).json({success: false, msg: messages.USER_CREATE_EXISTS});
            }
            else {
                const newUser = new User({
                    firstName,
                    lastName,
                    email,
                    password,
                    //userPic: request.file.path
                });

                // Create hash
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            newUser.password = hash;
                        }
                        // Save new User with hashed password
                        newUser.save()
                        .then(user => {
                            jwt.sign(
                                {id: user.id, name: user.email, firstName: user.firstName, lastName: user.lastName},
                                config.secret,
                                {expiresIn: config.tokenExpire},
                                (err, token) => {
                                    if(err){
                                        throw err;
                                    }
                                    else {
                                        response.json({success: true, token, user: {id: user.id, firstName: user.firstName, lastName: user.lastName, userPic: user.userPic}});
                                    }
                                }
                            )
                        })
                        .catch(error => resonse.status(500).json({success: false, msg: error}));
                    });
                });
            }
        })
    
    
});


module.exports = router;