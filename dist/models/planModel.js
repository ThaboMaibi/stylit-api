"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var PlanSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: [true, 'please enter plan name']
    },
    price: {
        type: String,
        required: [true, 'please enter price']
    }
});
module.exports = new mongoose.model('Plan', PlanSchema);
