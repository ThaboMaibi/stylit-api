const mongoose = require('mongoose')
const Schema = mongoose.Schema
export {};
// advancer profile model
var notificationsType = new Schema({
    name: {
        type: String,
        required: [true, 'please provide the notification type']
    }
}, { timestamps: true });

module.exports = mongoose.model('notificationsType', notificationsType);