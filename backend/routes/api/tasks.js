const express = require('express');

const logger = require('../../utilities/logger');
const messages = require('../../config/messages');
const authBoard = require ('../../tokenHandler/authBoard');
const authTaskList = require ('../../tokenHandler/authTaskList');
const authTask = require ('../../tokenHandler/authTask');
// Task  Model
const task = require('../../models/task');

const user = require('../../models/user');
const taskList = require('../../models/taskList');

const router = express.Router();

/*********************************************/
// @route POST api/tasks
// @desc Create a new Task
// @access Authorized Users
/*********************************************/
router.post('/', authTaskList, (request, response) => {
    const {header, taskListId } = request.body;
    // Validation for mandatory parameters
    if(!header || !taskListId){
        // Bad request
        return response.status(400).json({success: false, msg: messages.TASK_CREATE_BAD_REQUEST})
    }
    else{
        logger.log('POST /tasks', 'email is : ' + request.user.name);
        // Check for board Access
        if(request.boardAccess){
            logger.log('POST /tasks', 'request.user.boardAccess: ' +request.boardAccess );
            if(request.boardAccess ==='Admin' || request.boardAccess ==='User' ) {
                // Create Task
                const newTask = new Task({
                    header,
                    taskListId,
                    createdBy: request.user.name,
                    lastUpdatedBy: request.user.name
                });
                // Save new task to DB
                newTask.save()
                    .then(task => {
                        logger.log('POST /tasks', 'task ID for newly created task is: ' + task._id );
                        taskList.findByIdAndUpdate({_id: taskListId}, {$push: {tasks: task._id}}, function(err, model)
                    {
                        logger.log('POST /tasks', 'task ID for newly created task is: ' + task._id );
                        if (err) {
                            response.status(500).json({ success: false, msg: err });
                        }
                        else {
                            response.json(task);
                        }
                    })
                    })
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
// @route PUT api/tasks/:taskid
// @desc Updates a task for the Authorized user
// @access Authorized Users
/*********************************************/
router.put('/:taskid',authTask,(request, response) => {
    // Check for board Access
    logger.log('PUT api/boards/:taskid', 'request.user.name: ' +request.user.name );
    logger.log('PUT api/boards/:taskid', 'Passed task id is: ' +request.params.taskid );
    if(request.boardAccess){
        logger.log('PUT api/boards/:taskid', 'request.user.boardAccess: ' +request.boardAccess );
        if(request.boardAccess ==='Admin' || request.boardAccess ==='User') {
            var updatedTask = {
                header: request.body.header,
                description: request.body.description,
                taskListId: request.body.taskListId,
                status: request.body.status,
                assignedTo: request.body.assignedTo,
                dueDate: request.body.dueDate,
                order: request.body.order,
                lastUpdatedDate: new Date(),
                lastUpdatedBy: request.user.name        
            }
            task.findByIdAndUpdate(request.params.taskid, updatedTask, {new: true} , function(err, model)
            {
                if (err) {
                    response.status(500).json({ success: false, msg: err });
                }
                else {
                    response.json(model);
                }
            });
        }
        else {
            response.status(401).json({ success: false, msg: messages.BOARD_DELETE_NO_ACCESS })
        }
    }
    else {
        response.status(401).json({ success: false, msg: messages.BOARD_DELETE_NO_ACCESS })
    }
})


/*********************************************/
// @route DELETE api/boards/:taskid
// @desc Deletes a task for the Authorized user
// @access Authorized Users
/*********************************************/
router.delete('/:taskid', authTask, (request, response) => {
    // Check for board Access
    logger.log('DELETE api/boards/:taskid', 'request.user.name: ' +request.user.name );
    logger.log('DELETE api/boards/:taskid', 'Passed task id is: ' +request.params.taskid );
    if(request.boardAccess){
        logger.log('api/boards/:taskid', 'request.user.boardAccess: ' +request.boardAccess );
        if(request.boardAccess ==='Admin' || request.boardAccess ==='User') {
            task.findById(request.params.taskid)
                .then(task => {
                    task.remove()
                        .then(()=> {response.json({ success: true })})
                        .catch(error => response.status(500).json({ success: false, msg: error }))
                })
        }
        else {
            response.status(401).json({ success: false, msg: messages.BOARD_DELETE_NO_ACCESS })
        }
    }
    else {
        response.status(401).json({ success: false, msg: messages.BOARD_DELETE_NO_ACCESS })
    }
})

module.exports = router;