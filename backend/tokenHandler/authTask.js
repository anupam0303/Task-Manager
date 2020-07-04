const config = require('../config/configs');
const messages = require('../config/messages');
const jwt = require('jsonwebtoken');

// Board Model
const board = require('../models/board');
// Task List Model
const taskList = require('../models/taskList');
// Task  Model
const task = require('../models/task');
const logger = require('../utilities/logger');

function authTask(request, response, next) {
    const token = request.header('x-auth-token');
    let boardId = null;
    let taskId = null;
    // Check for token
    if(!token){
        return response.status(401).json({success: false, msg: messages.AUTH_NO_TOKEN});    
    }
    try {
        // Verify token
        const decoded = jwt.verify (token, config.secret);
        // Add User from payload
        request.user = decoded;

        // Get Task Id from request params
        if (request.params){
            if(request.params.taskid){
                taskId = request.params.taskid;
                logger.log('authTask', 'Got Task Id from request.params.tasklistid');
                task.findById(taskId)
                    .then(task => {
                        if(!task) {
                            // Task Not Found
                            logger.log('authTask', 'Task is not found');
                            return response.status(404).json({success: false, msg: messages.TASK_NOT_FOUND});
                        }
                        else {
                            // Task found, check for tasklist details
                            if(!task.taskListId){
                                logger.log('authTask', 'Task found but no taskListId in the task');
                                return response.status(404).json({success: false, msg: messages.TASK_MISSING_TASKLIST});
                            }
                            else {
                                // Task list ID also found, check for tasklist details
                                taskList.findById(task.taskListId)
                                    .then(taskList => {
                                        if(!taskList) {
                                            // Task List not found
                                            logger.log('authTask', 'TaskList is not found');
                                        }
                                        else {
                                            // Task List found, check for board details
                                            if(!taskList.boardId){
                                                logger.log('authTask', 'Task and Task list found but no boardId in the task List');
                                                return response.status(404).json({success: false, msg: messages.TASKLIST_MISSING_BOARD});
                                            }
                                            else {
                                                // boardId is found check for board details
                                                board.findById(taskList.boardId)
                                                    .then(board => {
                                                        if(!board) {
                                                            // Board Not Found
                                                            logger.log('authTask', 'Board is not found');
                                                            return response.status(404).json({success: false, msg: messages.BOARD_NOT_FOUND});
                                                        }
                                                        else {
                                                            // Board Found and check if User has access to it
                                                            if(board.createdBy ===request.user.name || board.adminUsers.includes(request.user.name)) {
                                                                // User has admin access to the board
                                                                logger.log('authTask', 'Setting Admin access');
                                                                request.boardAccess = 'Admin';
                                                            }
                                                            else if (board.memberUsers.includes(request.user.name) || board.invitedUsers.includes(request.user.name)) {
                                                                // User has user access to the board
                                                                logger.log('authTask', 'Setting User access');
                                                                request.boardAccess = 'User';
                                                            }
                                                            else {
                                                                logger.log('authTask', 'Setting User access');
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
                            }
                            
                        }
                        
                    })
                    .catch(error => response.status(404).json({success: false, msg: messages.TASK_NOT_FOUND}))
            }
        }
    } catch (exception) {
        response.status(401).json({success: false, msg: messages.AUTH_TOKEN_NOT_VALID + exception});  
    }
}

module.exports = authTask;