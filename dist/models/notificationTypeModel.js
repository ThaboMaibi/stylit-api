"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// advancer profile model
var notificationsType = new Schema({
    name: {
        type: String,
        required: [true, 'please provide the notification type']
    }
}, { timestamps: true });
module.exports = mongoose.model('notificationsType', notificationsType);
