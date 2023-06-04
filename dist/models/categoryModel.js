"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// advancer profile model
var category = new Schema({
    name: {
        type: String,
        required: [true, 'please provide the admins phone numbers']
    }
}, { timestamps: true });
module.exports = mongoose.model('category', category);
