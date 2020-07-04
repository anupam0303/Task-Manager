const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema ({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Active'
    },
    userPic: {
        type: String
    },
    createdDate: {
        type: Date,
        default: Date.now
    },
    lastUpdatedDate: {
        type: Date,
        default: Date.now
    },
    lastUpdatedBy: {
        type: String
    },
    lastLoginDate: {
        type: Date
    }
});

module.exports = User = mongoose.model('user', UserSchema);