const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const TaskSchema = new Schema ({
    header: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        required: true,
        default: 'Active'
    },
    assignedTo: {
        type: [String]
    },
    dueDate: {
        type: Date
    },
    order: {
        type: Number
    },
    taskListId: {
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

module.exports = Task = mongoose.model('task', TaskSchema);