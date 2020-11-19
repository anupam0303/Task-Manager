const config = require('../config/configs');
const messages = require('../config/messages');
const jwt = require('jsonwebtoken');

function auth(request, response, next) {
    const token = request.header('x-auth-token');

    // Check for token
    if(!token){
        return response.status(401).json({success: false, msg: messages.AUTH_NO_TOKEN});    
    }

    try {
        // Verify token
        const decoded = jwt.verify (token, config.secret);
        // Add User from payload
        request.user = decoded;
        next();
    } catch (exception) {
        response.status(401).json({success: false, msg: messages.AUTH_TOKEN_NOT_VALID + exception});  
    }
  
}

module.exports = auth;