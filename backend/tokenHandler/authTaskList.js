const config = require('../config/configs');
const messages = require('../config/messages');
const jwt = require('jsonwebtoken');

// Board Model
const board = require('../models/board');
// Task List Model
const taskList = require('../models/taskList');
const logger = require('../utilities/logger');

function authTaskList(request, response, next) {
    const token = request.header('x-auth-token');
    let boardId = null;
    let taskListId = null;
    // Check for token
    if(!token){
        return response.status(401).json({success: false, msg: messages.AUTH_NO_TOKEN});    
    }
    try {
        // Verify token
        const decoded = jwt.verify (token, config.secret);
        // Add User from payload
        request.user = decoded;

         // Get taskList Id from request Body
         if(request.body.taskListId){
            taskListId = request.body.taskListId;
            logger.log('authTaskList', 'Got Task List Id from request.body.taskListId');
        }
        // Get Task List Id from request params
        else if (request.params){
            if(request.params.tasklistid){
                taskListId = request.params.tasklistid;
                logger.log('authTaskList', 'Got Task List Id from request.params.tasklistid');
            }
        }
                taskList.findById(taskListId)
                    .then(taskList => {
                        if(!taskList) {
                            // TAsk List Not Found
                            logger.log('authTaskList', 'Task List is not found');
                            return response.status(404).json({success: false, msg: messages.TASKLIST_NOT_FOUND});
                        }
                        else {
                            // Task List found, check for board details
                            if(!taskList.boardId){
                                logger.log('authTaskList', 'Task List found but no boardId in the task List');
                                return response.status(404).json({success: false, msg: messages.TASKLIST_MISSING_BOARD});
                            }
                            else {
                                board.findById(taskList.boardId)
                                    .then(board => {
                                        if(!board) {
                                            // Board Not Found
                                            logger.log('authTaskList', 'Board is not found');
                                            return response.status(404).json({success: false, msg: messages.BOARD_NOT_FOUND});
                                        }
                                        else {
                                            // Board Found and check if User has access to it
                                            if(board.createdBy ===request.user.name || board.adminUsers.includes(request.user.name)) {
                                                // User has admin access to the board
                                                logger.log('authTaskList', 'Setting Admin access');
                                                request.boardAccess = 'Admin';
                                            }
                                            else if (board.memberUsers.includes(request.user.name) || board.invitedUsers.includes(request.user.name)) {
                                                // User has user access to the board
                                                logger.log('authTaskList', 'Setting User access');
                                                request.boardAccess = 'User';
                                            }
                                            else {
                                                logger.log('authTaskList', 'Setting User access');
                                                request.boardAccess = 'None';
                                            }
                                        }
                                        next();
                                    })
                                    .catch(error => response.status(404).json({success: false, msg: messages.BOARD_NOT_FOUND}))
                            }
                            
                        }
                        
                    })
                    .catch(error => response.status(404).json({success: false, msg: messages.TASKLIST_NOT_FOUND}))
    } catch (exception) {
        response.status(401).json({success: false, msg: messages.AUTH_TOKEN_NOT_VALID + exception});  
    }
}

module.exports = authTaskList;