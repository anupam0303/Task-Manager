const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const TaskListSchema = new Schema ({
    taskListName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Active'
    },
    boardId: {
        type: String,
        required: true
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String
    },
    lastUpdatedDate: {
        type: Date,
        default: Date.now
    },
    lastUpdatedBy: {
        type: String
    }
});

module.exports = TaskList = mongoose.model('taskList', TaskListSchema);