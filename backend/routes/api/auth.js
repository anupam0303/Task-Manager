const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../../config/configs');
const messages = require('../../config/messages');
const logger = require('../../utilities/logger');

//User Model
const user = require('../../models/user');


/*********************************************/
// @route GET api/auth/verifyToken
// @desc Verifies Token
// @access Public
/*********************************************/
router.get('/verifytoken', (request, response) => {
    const token = request.header('x-auth-token');

    // Check for token
    if(!token){
        return response.status(401).json({success: false, msg: messages.AUTH_NO_TOKEN});    
    }

    try {
        // Verify token
        const decoded = jwt.verify (token, config.secret);
        const user =decoded;
        response.json({success: true, token, id: user.id, firstName: user.firstName, lastName: user.lastName, userPic: user.userPic});
    } catch (exception) {
        response.status(401).json({success: false, msg: messages.AUTH_TOKEN_NOT_VALID + exception});  
    }
});

/*********************************************/
// @route POST api/auth
// @desc Authenticate user
// @access Public
/*********************************************/
router.post('/', (request, response) => {
    const { email, password } = request.body;

    // Validations
    if (!email || !password) {
        return response.status(400).json({ success: false, msg: messages.AUTH_BAD_REQUEST })
    }

    // Check for existing user
    user.findOne({ email })
        .then(user => {
            if (!user) return response.status(400).json({ success: false, msg: messages.USER_NOT_FOUND });
            if (user.status!=='Active') return response.status(400).json({ success: false, msg: messages.USER_NOT_ACTIVE});

            // Validate user password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) return response.status(401).json({ success: false, msg: messages.AUTH_INVALID_CREDENTIALS });
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

        })
});

module.exports = router;