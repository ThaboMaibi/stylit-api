
const mongoose2 = require('mongoose')

const Schema2 = mongoose2.Schema
// publisher rpofile
var advancerProfile = new Schema2({
    userId: {
        type: mongoose2.ObjectId,
        required: [true, 'please provide the user Id'],
        ref: 'User'  
    },
    planId: {
        type: mongoose2.ObjectId,
        required: [true, 'please provide the plan Id'],
        ref: 'Plan'
    },
    company: {
        type: String,
        default:''
    },
    website: {
        type: String,
        default:''
    },
    applicationPassword: {
        type: String,
        default:''
    },
    wordpressAdminName: {
        type: String,
        default:''
    },
    status: {
        type: String,
        default:'approved'
    }
}, { timestamps: true });
module.exports = mongoose2.model('advancerProfile', advancerProfile);