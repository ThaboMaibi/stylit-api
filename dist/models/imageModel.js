"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var imageSchema = new mongoose.Schema({
    articleId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the article Id'],
        ref: 'article'
    },
    name: String,
    img: {
        data: Buffer,
        contentType: String
    }
});
module.exports = new mongoose.model('Image', imageSchema);
