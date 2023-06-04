const mongoose = require('mongoose')
const Schema = mongoose.Schema
export {};
// advancer profile model
var article = new Schema({
    userId: {
        type: mongoose.ObjectId,
        required: [true, 'please provide the user Id'],
        ref: 'User'
    },
    userInfo:{
        type: Array,
        default:[]
    },
    category:{
        categoryId: {
            type: mongoose.ObjectId,
            required: [true, 'please provide the user Id'],
            ref: 'category'
           },
        name:{
            type:String
        }
     },
    title: {
        type: String,
        required: [true, 'please provide the title']
    },
    body: {
        type: String,
        required: [true, 'please provide the body']
    },
    state: {
        type: String,
        required: [true, 'please provide the state of article']
    },
    articleMedia:{
        type: Array,
        default:[]
    },
    articleContent:{
        type: Array,
        default:[]
    },
    advanced:{
        type: Array,
        default:[]
    },
    advanceCount:{
     type:Number,
     default: 0
    },
    reads:{
        type: Array,
        default:[]
    },
    views:{
        type: Array,
        default:[]
    },
    read: {
        type: Number,
        required: [true, 'please provide the user Id'],
        default:0
        },
    viewed:{
        type: Number,
        required: [true, 'please provide the user Id'],
        default:0
    }
}, { timestamps: true });

module.exports = mongoose.model('article', article);