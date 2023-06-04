const mongoose1 = require('mongoose')

const Schema1 = mongoose1.Schema
// advancer profile model
var publisherProfile = new Schema1({
    userId: {
        type: mongoose1.ObjectId,
        required: [true, 'please provide the user Id'],
        ref: 'User'
    },
    planId: {
        type: mongoose1.ObjectId,
        required: [true, 'please provide the user Id'],
        ref: 'Plan'
    },
    organisation: {
        type: String,
        required: [true, 'please provide the name of the organisation']
    },
    status: {
        type: String,
        default:'pending'
    },
    followers:{
     type:Array,
     default:[]
    },
    NoFollowers:{
     type:Number,
     default:0
    }
}, { timestamps: true });

module.exports = mongoose1.model('publisherProfile', publisherProfile);