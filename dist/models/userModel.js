"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'please enter name']
    },
    surname: {
        type: String,
        required: [true, 'please enter surname']
    },
    email: {
        type: String,
        required: [true, 'please enter email'],
        unique: true
    },
    password: {
        type: String
    },
    isAccountDeactivated: {
        type: Boolean,
        required: false,
        default: false
    },
    passwordResetToken: {
        type: String,
        required: false,
        default: ''
    },
    deleteAccountToken: {
        type: String,
        required: false,
        default: ''
    },
    provider: {
        type: Number,
        required: false,
        default: 0
    },
    profilePicture: {
        type: Array,
        default: []
    },
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
