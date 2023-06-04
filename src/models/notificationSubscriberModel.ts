const mongoose = require('mongoose')
const Schema = mongoose.Schema
export {};
// advancer profile model
var notificationSubscriber = new Schema({
    userId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the user Id'],
        ref: 'User'
    },
    email: {
        type: String,
        required: [true, 'please provide the user email']
    },
    typeId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the user Id'],
        ref: 'notificationType'
    }
}, { timestamps: true });

module.exports = mongoose.model('notificationSubscriber', notificationSubscriber);