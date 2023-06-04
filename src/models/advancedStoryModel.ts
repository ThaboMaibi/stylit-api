const mongoose = require('mongoose')
const Schema = mongoose.Schema
export {};
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