const mongoose = require('mongoose')
const Schema = mongoose.Schema
export {};
// advancer profile model
var category = new Schema({
    name: {
        type: String,
        required: [true, 'please provide the admins phone numbers']
    }
}, { timestamps: true });

module.exports = mongoose.model('category', category);