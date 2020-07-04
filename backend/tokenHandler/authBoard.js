const config = require('../config/configs');
const messages = require('../config/messages');
const jwt = require('jsonwebtoken');

// Board Model
const board = require('../models/board');
const logger = require('../utilities/logger');

function authBoard(request, response, next) {
    const token = request.header('x-auth-token');
    let boardId = null;
    // Check for token
    if(!token){
        return response.status(401).json({success: false, msg: messages.AUTH_NO_TOKEN});    
    }
    try {
        // Verify token
        const decoded = jwt.verify (token, config.secret);

        // Get board Id from request Body
        if(request.body.boardId){
            boardId = request.body.boardId;
            logger.log('authBoard', 'Got Board Id from request.body.boardId');
        }
        // Get board Id from request params
        else if (request.params){
            if(request.params.boardid){
                boardId = request.params.boardid;
                logger.log('authBoard', 'Got Board Id from request.params.boardid');
            }
        }
        logger.log('authBoard', 'Board Id is: ' + boardId);
        // Add User from payload
        request.user = decoded;
        // If no board Id is determined
        if (!boardId){
            return response.status(401).json({success: false, msg: messages.AUTH_BOARD_NOT_DETERMINED}); 
        }
        // Board ID is determined, check the user access on the board
        else {
            board.findById(boardId)
                .then(board => {
                    if(!board) {
                        // Board Not Found
                        logger.log('authBoard', 'Board is not found');
                        return response.status(404).json({success: false, msg: messages.BOARD_NOT_FOUND});
                    }
                    else {
                        // Board Found and check if User has access to it
                        if(board.createdBy ===request.user.name || board.adminUsers.includes(request.user.name)) {
                            // User has admin access to the board
                            logger.log('authBoard', 'Setting Admin access');
                            request.boardAccess = 'Admin';
                        }
                        else if (board.memberUsers.includes(request.user.name) || board.invitedUsers.includes(request.user.name)) {
                            // User has user access to the board
                            logger.log('authBoard', 'Setting User access');
                            request.boardAccess = 'User';
                        }
                        else {
                            logger.log('authBoard', 'Setting User access');
                            request.boardAccess = 'None';
                        }
                    }
                    next();
                })
                .catch(error => response.status(404).json({success: false, msg: messages.BOARD_NOT_FOUND}))
        }
    } catch (exception) {
        response.status(401).json({success: false, msg: messages.AUTH_TOKEN_NOT_VALID + exception});  
    }

    
}

module.exports = authBoard;