"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var profilePicSchema = new mongoose.Schema({
    userId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the article Id'],
        ref: 'User'
    },
    name: {
        type: String
    }
});
module.exports = new mongoose.model('profilePic', profilePicSchema);
