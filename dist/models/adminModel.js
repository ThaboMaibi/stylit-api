"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// advancer profile model
var adminProfile = new Schema({
    userId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the user Id'],
        ref: 'User'
    },
    phoneNumber: {
        type: String,
        required: [true, 'please provide the admins phone numbers']
    },
    location: {
        type: String,
        required: [true, 'please provide the admins location']
    },
    description: {
        type: String
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
module.exports = mongoose.model('adminProfile', adminProfile);
