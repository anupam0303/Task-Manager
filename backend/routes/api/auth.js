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
                        {id: user.id, name: user.email},
                        config.secret,
                        {expiresIn: config.tokenExpire},
                        (err, token) => {
                            if(err){
                                throw err;
                            }
                            else {
                                response.json({token, user: {id: user.id, firstName: user.firstName, lastName: user.lastName, userPic: user.userPic}});
                            }
                        }
                    )
                })

        })
});

module.exports = router;