"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var subscribersSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the user Id'],
        ref: 'User'
    },
    planId: {
        type: mongoose.ObjectId,
        required: [true, 'please enter price'],
        ref: 'Plan'
    }
});
module.exports = new mongoose.model('Subscribers', subscribersSchema);
