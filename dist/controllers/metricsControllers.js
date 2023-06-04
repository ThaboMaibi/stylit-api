"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var articleModel = require('../models/articleModel');
var userModel = require('../models/userModel');
var ObjectId = require('mongoose').Types.ObjectId;
//get articles
var getPostedArticlesMonthly = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var articles, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, articleModel.aggregate([
                        {
                            $project: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" },
                                day: { $dayOfMonth: "$createdAt" },
                                week: { $week: "$createdAt" }
                            }
                        }
                    ])];
            case 1:
                articles = _a.sent();
                res.status(200).json({ 'status': true, articles: articles });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(400).json({ error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//get articles
var getReadArticles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            articleModel.countDocuments({ "metrics.read": { $gt: 0 } }, function (err, count) {
                if (err)
                    res.status(400).json({ error: err.message });
                else
                    res.status(200).json({ 'status': true, count: count });
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); };
//get articles
var getViewedArticles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            articleModel.countDocuments({ "viewed": { $gt: 0 } }, function (err, count) {
                if (err)
                    res.status(400).json({ error: err.message });
                else
                    res.status(200).json({ 'status': true, count: count });
            });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
        return [2 /*return*/];
    });
}); };
//get articles
var addViewedArticle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var articleId, d, month, viewedArticle, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                articleId = req.body.articleId;
                d = new Date();
                month = d.getMonth();
                if (!ObjectId.isValid(articleId)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, articleModel.findByIdAndUpdate(articleId, { $inc: { "viewed": 1 }, $push: { "views": { month: month } } })];
            case 2:
                viewedArticle = _a.sent();
                res.status(200).json({ 'status': true, message: 'viewing of this article saved' });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(400).json({ error: error_2.message });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ status: false, error: 'The provided Id is invalid' });
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
//get articles
var addReadArticle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var articleId, d, month, readArticle, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                articleId = req.body.articleId;
                d = new Date();
                month = d.getMonth();
                if (!ObjectId.isValid(articleId)) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, articleModel.findByIdAndUpdate(articleId, { $inc: { "read": 1 }, $push: { "reads": { month: month } } })];
            case 2:
                readArticle = _a.sent();
                res.status(200).json({ 'status': true, message: 'reading of this article saved' });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(400).json({ error: error_3.message });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ status: false, error: 'The provided Id is invalid' });
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
//get articles
var getWeeklyTopPublisher = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var aticles, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userModel.aggregate([
                        { $lookup: {
                                from: 'articles',
                                localField: '_id',
                                foreignField: 'userId',
                                as: 'articles'
                            },
                        },
                        { $unwind: "$articles" },
                        { $group: { _id: "$userId", "username": { $first: "$name" }, "surname": { $first: "$surname" }, "userId": { $first: "$_id" }, "location": { $first: "$countryCode" }, number_of_articles: { $sum: 1 } } },
                        { $project: { "name": "$username", "surname": "$surname", "location": "$location", "userId": "$userId", _id: 0, number_of_articles: 1 } },
                        { $sort: { number_of_articles: 1 } }
                    ])];
            case 1:
                aticles = _a.sent();
                if (!aticles) {
                    res.status(400).json({ error: "There are no articles" });
                }
                res.status(200).json({ 'status': true, list: aticles });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(400).json({ error: error_4.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//get articles
var getWeeklyTopAdvancers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var aticles, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userModel.aggregate([
                        { $lookup: {
                                from: 'advancedstories',
                                localField: '_id',
                                foreignField: 'advancerUserId',
                                as: 'articles'
                            },
                        },
                        { $unwind: "$articles" },
                        { $group: { _id: "$advancerUserId", "username": { $first: "$name" }, "surname": { $first: "$surname" }, "userId": { $first: "$_id" }, "location": { $first: "$countryCode" }, number_of_articles: { $sum: 1 } } },
                        { $project: { "name": "$username", "surname": "$surname", "location": "$location", "userId": "$userId", _id: 0, number_of_articles: 1 } },
                        { $sort: { number_of_articles: 1 } }
                    ])];
            case 1:
                aticles = _a.sent();
                if (!aticles) {
                    res.status(400).json({ error: "There are no articles" });
                }
                res.status(200).json({ 'status': true, list: aticles });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(400).json({ error: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getpublishedArticlesLocated = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var aticles, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userModel.aggregate([
                        { $lookup: {
                                from: 'articles',
                                localField: '_id',
                                foreignField: 'userId',
                                as: 'articles'
                            },
                        },
                        { $unwind: "$articles" },
                        { $group: { _id: "$countryCode", "location": { $first: "$countryCode" }, number_of_articles: { $sum: 1 } } },
                        { $project: { "location": "$location", number_of_articles: 1 } },
                        { $sort: { number_of_articles: 1 } }
                    ])];
            case 1:
                aticles = _a.sent();
                if (!aticles) {
                    res.status(400).json({ error: "There are no articles" });
                }
                res.status(200).json({ 'status': true, list: aticles });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.status(400).json({ error: error_6.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//for many 
module.exports = {
    getWeeklyTopPublisher: getWeeklyTopPublisher,
    getPostedArticlesMonthly: getPostedArticlesMonthly,
    getReadArticles: getReadArticles,
    getViewedArticles: getViewedArticles,
    addReadArticle: addReadArticle,
    addViewedArticle: addViewedArticle,
    getWeeklyTopAdvancers: getWeeklyTopAdvancers,
    getpublishedArticlesLocated: getpublishedArticlesLocated
};
