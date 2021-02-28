const express = require('express');

const logger = require('../../utilities/logger');
const messages = require('../../config/messages');
const authTaskList = require ('../../tokenHandler/authTaskList');
const authBoard = require ('../../tokenHandler/authBoard');
// Task List Model
const taskList = require('../../models/taskList');
// Board Model
const board = require('../../models/board');
// Task Model
const task = require('../../models/task');
const user = require('../../models/user');

const router = express.Router();

/*********************************************/
// @route POST api/tasklists
// @desc Create a new Task List
// @access Authorized Users
/*********************************************/
router.post('/', authBoard, (request, response) => {
    const {taskListName, boardId} = request.body;
    // Validation for mandatory parameters
    if(!taskListName || !boardId){
        // Bad request
        return response.status(400).json({success: false, msg: messages.TASKLIST_CREATE_BAD_REQUEST})
    }
    else{
        logger.log('/tasklists POST API', 'email is : ' + request.user.name);
        // Check for board Access
        if(request.boardAccess){
            logger.log('/tasklists POST API', 'request.user.boardAccess: ' +request.boardAccess );
            if(request.boardAccess ==='Admin') {
                // Create Task List
                const newTaskList = new TaskList({
                    taskListName: request.body.taskListName,
                    boardId: request.body.boardId,
                    createdBy: request.user.name,
                    lastUpdatedBy: request.user.name
                });
                newTaskList.save()
                    .then(taskList => response.json(taskList))
                    .catch(error => response.status(500).json({success: false, msg: error}));
            }
            else {
                response.status(401).json({ success: false, msg: messages.BOARD_NO_ACCCESS });
            }
        }
        else {
            response.status(401).json({ success: false, msg: messages.BOARD_NO_ACCCESS });
        }
    }
})


/*********************************************/
// @route GET api/tasklists/:tasklistid
// @desc Gets tasks for a tasklist for the Authorized user
// @access Authorized Users
/*********************************************/
router.get('/:tasklistid', authTaskList, (request, response) => {
    // Check for board Access
    logger.log('GET api/tasklists/:tasklistid', 'request.user.name: ' +request.user.name );
    logger.log('GET api/tasklists/:tasklistid', 'Passed tasklistid is: ' +request.params.tasklistid );
    logger.log('GET api/tasklists/:tasklistid', 'request.user.boardAccess: ' +request.boardAccess );
    if(request.boardAccess){
        if(request.boardAccess ==='Admin' || request.boardAccess ==='User') {
            // Get tasks for tasklist
            task.find({taskListId: request.params.tasklistid})
                .then(task => { 
                    response.json({taskListId: request.params.tasklistid, task});
                })
                .catch(error => response.status(500).json({success: false, msg: error}))
        }
        else {
            response.status(401).json({ success: false, msg: messages.BOARD_NO_ACCCESS })
        }
    }
    else {
        response.status(401).json({success: false, msg: messages.BOARD_NO_ACCCESS})
    }
})

module.exports = router;