"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// advancer profile model
var notifications = new Schema({
    message: {
        type: String,
        required: [true, 'please provide the message']
    },
    typeId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the user Id'],
        ref: 'notificationType'
    }
}, { timestamps: true });
module.exports = mongoose.model('notifications', notifications);
