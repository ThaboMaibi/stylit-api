"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// advancer profile model
var advancedStory = new Schema({
    advancerUserId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the user Id'],
        ref: 'User'
    },
    articleId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the article Id'],
        ref: 'article'
    }
}, { timestamps: true });
module.exports = mongoose.model('advancedStory', advancedStory);
