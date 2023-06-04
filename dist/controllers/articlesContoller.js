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
var User = require('../models/userModel');
var categoryModel = require('../models/categoryModel');
//add article with Media
var addArticle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var category, user_1, article, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, categoryModel.findById(req.body.categoryId)];
            case 1:
                category = _a.sent();
                return [4 /*yield*/, User.findById(req.body.userId)];
            case 2:
                user_1 = _a.sent();
                if (!category) return [3 /*break*/, 4];
                return [4 /*yield*/, articleModel.create({
                        userId: req.body.userId,
                        category: {
                            categoryId: req.body.categoryId,
                            name: category.name
                        },
                        title: req.body.title,
                        body: req.body.body,
                        state: req.body.state,
                        userInfo: { username: user_1.name, surname: user_1.surname }
                    })];
            case 3:
                article = _a.sent();
                if (article) {
                    res.status(200).json({ 'status': true, article: article, message: "article successfully added" });
                }
                else {
                    res.status(400).json({ 'status': false, error: 'Error uploading the article info' });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(400).json({ 'status': false, error: 'Category not found' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                res.status(400).json({ error: error_1.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
//add article with Media
var addArticleCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var article, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, categoryModel.create({
                        name: req.body.name,
                    })];
            case 1:
                article = _a.sent();
                if (article) {
                    res.status(200).json({ 'status': true, message: "article category successfully added" });
                }
                else {
                    res.status(400).json({ 'status': false, error: 'Error uploading the article info' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(400).json({ error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//get articles
var getArticleCategories = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, categoryModel.find().sort({ createdAt: -1 })];
            case 1:
                query = _a.sent();
                if (!query) {
                    res.status(400).json({ 'status': false, error: "no category found" });
                }
                res.status(200).json({ 'status': true, 'categories': query });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(400).json({ error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//add article with Media
var advanceStory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var d, month, article, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                d = new Date();
                month = d.getMonth();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, articleModel.findByIdAndUpdate(req.body.articleId, {
                        $push: { "advanced": { advancerUserId: req.body.advancerUserId, month: month } }, $inc: { "advanceCount": 1 }
                    })];
            case 2:
                article = _a.sent();
                if (article) {
                    res.status(200).json({ 'status': true, article: article, message: "successfully advanced story" });
                }
                else {
                    res.status(400).json({ 'status': false, error: 'Error uploading the article info' });
                }
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(400).json({ error: error_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
//get articles
var getArticles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var aticles, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, articleModel.find({ "state": "published" }).sort({ createdAt: -1 })];
            case 1:
                aticles = _a.sent();
                if (!aticles) {
                    res.status(400).json({ error: "There are no advanced articles" });
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
//get articles
var getArticlesForLandingPage = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var aticles, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, articleModel.find({ "state": "published" }).sort({ createdAt: -1 }).limit(3)];
            case 1:
                aticles = _a.sent();
                if (!aticles) {
                    res.status(400).json({ error: "There are no published articles" });
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
//get articles
var getAdvancedStories = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var aticles, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, articleModel.find({ "advanceCount": { $gt: 0 }, "state": "published" }).sort({ createdAt: -1 })];
            case 1:
                aticles = _a.sent();
                if (!aticles) {
                    res.status(400).json({ error: "There are no advanced articles" });
                }
                res.status(200).json({ 'status': true, list: aticles });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                res.status(400).json({ error: error_7.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//get articles
var getRecentArticles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var articles, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, articleModel.find({ "state": "published" }).sort({ createdAt: -1 }).limit(4)];
            case 1:
                articles = _a.sent();
                if (!articles) {
                    res.status(400).json({ error: "There are no articles" });
                }
                res.status(200).json({ 'status': true, list: articles });
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                res.status(400).json({ error: error_8.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//for many
module.exports = { addArticle: addArticle, getArticles: getArticles, advanceStory: advanceStory, getAdvancedStories: getAdvancedStories, getArticleCategories: getArticleCategories, addArticleCategory: addArticleCategory, getRecentArticles: getRecentArticles, getArticlesForLandingPage: getArticlesForLandingPage };
