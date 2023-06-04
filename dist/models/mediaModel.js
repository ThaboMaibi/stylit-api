"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var MediaSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the article Id'],
        ref: 'article'
    },
    name: String
});
module.exports = new mongoose.model('Media', MediaSchema);
