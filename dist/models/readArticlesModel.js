"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var readArticlesSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the article Id'],
        ref: 'article'
    },
    duration: String
}, { timestamps: true });
module.exports = new mongoose.model('readArticles', readArticlesSchema);
