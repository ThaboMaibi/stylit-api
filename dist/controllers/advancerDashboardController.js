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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var articleModel = require('../models/articleModel');
var publisherModel = require('../models/publisherModel');
var User = require('../models/userModel');
var advancerModel = require('../models/advancerModel');
var publisherProfile = require('../models/publisherModel');
var axios_1 = __importDefault(require("axios"));
//republish article
var republishArticle = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var articleId, today, dd, mm, yyyy, todayDate, advancerObject, user_1, article, website, _a, data, status_1, pic, error_1, error_2, error_3, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                articleId = req.body.articleId;
                today = new Date();
                dd = String(today.getDate()).padStart(2, '0');
                mm = String(today.getMonth() + 1).padStart(2, '0');
                yyyy = today.getFullYear();
                todayDate = mm + '/' + dd + '/' + yyyy;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 18, , 19]);
                return [4 /*yield*/, advancerModel.findOne({ userId: req.params.id })];
            case 2:
                advancerObject = _b.sent();
                return [4 /*yield*/, User.findById(req.params.id)];
            case 3:
                user_1 = _b.sent();
                return [4 /*yield*/, articleModel.findById(articleId)];
            case 4:
                article = _b.sent();
                website = advancerObject.website;
                if (!(article && advancerObject)) return [3 /*break*/, 16];
                _b.label = 5;
            case 5:
                _b.trys.push([5, 14, , 15]);
                _b.label = 6;
            case 6:
                _b.trys.push([6, 12, , 13]);
                return [4 /*yield*/, axios_1.default.post("".concat(advancerObject.website, "/wp-json/wp/v2/posts"), { title: article.title, content: "<!-- wp:paragraph -->".concat(article.body, "<!-- /wp:paragraph -->"), status: "draft" }, {
                        headers: {
                            'Content-Type': 'application/json',
                            "Accept": 'application/json',
                            "Authorization": "Basic " + Buffer.from("".concat(advancerObject.wordpressAdminName, ":").concat(advancerObject.applicationPassword)).toString("base64")
                        },
                    })];
            case 7:
                _a = _b.sent(), data = _a.data, status_1 = _a.status;
                _b.label = 8;
            case 8:
                _b.trys.push([8, 10, , 11]);
                return [4 /*yield*/, articleModel.findOneAndUpdate({ _id: articleId }, { $push: { "advanced": { name: user_1.name,
                                surname: user_1.surname,
                                advancerUserId: req.params.id,
                                date: todayDate } }, $inc: { "advanceCount": 1 } })];
            case 9:
                pic = _b.sent();
                res.status(200).json({ 'status': true, message: "Successfully advanced a story" });
                return [3 /*break*/, 11];
            case 10:
                error_1 = _b.sent();
                res.status(400).json({ 'status': false, error: 'The article successfully republihed to wordpress but failed to be saved in our database ' });
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 13];
            case 12:
                error_2 = _b.sent();
                if (axios_1.default.isAxiosError(error_2)) {
                    res.status(400).json({ error: 'From axios: ' + error_2.message + "" + website });
                }
                else {
                    res.status(400).json({ error: 'An unexpected error occurred' });
                }
                return [3 /*break*/, 13];
            case 13: return [3 /*break*/, 15];
            case 14:
                error_3 = _b.sent();
                res.status(400).json({ error: error_3.message });
                return [3 /*break*/, 15];
            case 15: return [3 /*break*/, 17];
            case 16:
                res.status(400).json({ 'status': false, error: 'User is not an advancer or the article does not exist ' });
                _b.label = 17;
            case 17: return [3 /*break*/, 19];
            case 18:
                error_4 = _b.sent();
                res.status(400).json({ error: error_4.message });
                return [3 /*break*/, 19];
            case 19: return [2 /*return*/];
        }
    });
}); };
//get advancer by id
var getAdvancerById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var advancerObject, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, advancerModel.findOne({ userId: req.params.id })];
            case 1:
                advancerObject = _a.sent();
                if (!advancerObject) {
                    res.status(400).json({ error: "user not found" });
                }
                else {
                    res.status(200).json({ 'status': true,
                        "AdvancerObject": advancerObject });
                }
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(400).json({ error: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//get republished articles
var getRepublishedArticles = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var articles, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, articleModel.find({ $and: [{ "advanced.advancerUserId": req.params.id }] }).select('-advanced')];
            case 1:
                articles = _a.sent();
                if (!articles) {
                    res.status(400).json({ error: "user not found" });
                }
                res.status(200).json({ 'status': true, list: articles });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.status(400).json({ error: error_6.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//get a number of followed publishers
var getfollowedPublishersNo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, articles, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.find({ userId: req.params.id })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, publisherProfile.countDocuments({ $and: [{ "followers.advancerUserId": req.params.id }] }, function (err, count) {
                        if (err)
                            res.status(400).json({ error: err.message });
                        else
                            res.status(200).json({ 'status': true, count: count });
                    })];
            case 3:
                articles = _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_7 = _a.sent();
                res.status(400).json({ error: error_7.message });
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                res.status(400).json({ 'status': false, error: 'User not found' });
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
//get followed publishers
var getFollowedPublishers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var publisherArray, publishers, x, publisherUserDetail, object, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publisherArray = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                return [4 /*yield*/, publisherProfile.find({ $and: [{ "followers.advancerUserId": req.params.id }] })];
            case 2:
                publishers = _a.sent();
                if (!!publishers) return [3 /*break*/, 3];
                res.status(400).json({ error: "user not found" });
                return [3 /*break*/, 8];
            case 3:
                x = 0;
                _a.label = 4;
            case 4:
                if (!(x <= publishers.length - 1)) return [3 /*break*/, 7];
                return [4 /*yield*/, User.findById(publishers[x].userId)];
            case 5:
                publisherUserDetail = _a.sent();
                object = {
                    "name": publisherUserDetail.name,
                    "publisherUserId": publisherUserDetail._id,
                    "surnme": publisherUserDetail.surname,
                    "organisation": publishers[x].organisation,
                    "email": publisherUserDetail.email,
                    "date": publishers[x].followers.filter(function (date) { return req.params.id == date.advancerUserId; }),
                };
                publisherArray.push(object);
                _a.label = 6;
            case 6:
                x++;
                return [3 /*break*/, 4];
            case 7:
                res.status(200).json({ 'status': true, list: publisherArray });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_8 = _a.sent();
                res.status(400).json({ error: error_8.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
//get followed publishers
var unFollowPublisher = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var publisherUserId, publisher, unfollow, error_9, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publisherUserId = req.body.publisherUserId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, publisherProfile.findOne({ userId: publisherUserId, $and: [{ "followers.advancerUserId": req.params.id }] })];
            case 2:
                publisher = _a.sent();
                if (!!publisher) return [3 /*break*/, 3];
                res.status(400).json({ error: "You are not following this publisher" });
                return [3 /*break*/, 6];
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, publisherModel.findOneAndUpdate({ userId: publisherUserId }, { $pull: { "followers": { advancerUserId: req.params.id } }, $inc: { "NoFollowers": -1 } })];
            case 4:
                unfollow = _a.sent();
                res.status(200).json({ 'status': true, message: "Successfully unfollowed a publisher" });
                return [3 /*break*/, 6];
            case 5:
                error_9 = _a.sent();
                res.status(400).json({ error: error_9.message });
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                error_10 = _a.sent();
                res.status(400).json({ error: error_10.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
//follow a certain publisher
var followPublisher = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var publisherUserId, today, dd, mm, yyyy, todayDate, publishers, publisher, user_2, pic, error_11, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                publisherUserId = req.body.publisherUserId;
                today = new Date();
                dd = String(today.getDate()).padStart(2, '0');
                mm = String(today.getMonth() + 1).padStart(2, '0');
                yyyy = today.getFullYear();
                todayDate = mm + '/' + dd + '/' + yyyy;
                return [4 /*yield*/, publisherProfile.find({ $and: [{ "followers.advancerUserId": req.params.id }] })];
            case 1:
                publishers = _a.sent();
                publisher = publishers.filter(function (publisher) {
                    return publisher.userId == publisherUserId;
                });
                if (!(publisher.length > 0)) return [3 /*break*/, 2];
                res.status(400).json({ 'status': false, error: 'You have already followed this publisher' });
                return [3 /*break*/, 11];
            case 2:
                _a.trys.push([2, 10, , 11]);
                return [4 /*yield*/, User.findById(req.params.id)];
            case 3:
                user_2 = _a.sent();
                if (!user_2) return [3 /*break*/, 8];
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, publisherModel.findOneAndUpdate({ userId: publisherUserId }, { $push: { "followers": { name: user_2.name,
                                surname: user_2.surname,
                                advancerUserId: req.params.id,
                                date: todayDate } }, $inc: { "NoFollowers": 1 } })];
            case 5:
                pic = _a.sent();
                res.status(200).json({ 'status': true, message: "Successfully followed a publisher" });
                return [3 /*break*/, 7];
            case 6:
                error_11 = _a.sent();
                res.status(400).json({ error: error_11.message });
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                res.status(400).json({ 'status': false, error: 'User not found' });
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_12 = _a.sent();
                res.status(400).json({ error: error_12.message });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
//republish article
var addWebsiteLink = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var websiteLink, user_3, advancer, pic, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                websiteLink = req.body.websiteLink;
                if (!isValidUrl(websiteLink)) return [3 /*break*/, 9];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, User.findById(req.params.id)];
            case 2:
                user_3 = _a.sent();
                return [4 /*yield*/, advancerModel.find({ userId: user_3._id })];
            case 3:
                advancer = _a.sent();
                if (!advancer) return [3 /*break*/, 5];
                return [4 /*yield*/, advancerModel.findOneAndUpdate({ userId: req.params.id }, { $push: { "website": { websiteLink: websiteLink } } })];
            case 4:
                pic = _a.sent();
                res.status(200).json({ 'status': true, message: "Successfully followed a publisher" })
                    .catch(function (err) { return res.status(400).json({ error: err.message }); });
                return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ 'status': false, error: 'User is not an advancer' });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_13 = _a.sent();
                res.status(400).json({ error: error_13.message });
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(400).json({ 'status': false, error: 'Invalid URL' });
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
//allow the advancer to delete the uploaded 
var deleteWebsiteLink = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var websiteLink, pic;
    return __generator(this, function (_a) {
        websiteLink = req.body.websiteLink;
        if (isValidUrl(websiteLink)) {
            pic = advancerModel.findOneAndUpdate({ userId: req.params.id }, { $pull: { 'website': { websiteLink: websiteLink } } });
            pic.save().then(function () { return res.status(200).json({ 'status': true, message: "Website successfully deleted" }); })
                .catch(function (err) { return res.status(400).json({ error: err.message }); });
        }
        else {
            res.status(400).json({ 'status': false, error: 'Invalid URL' });
        }
        return [2 /*return*/];
    });
}); };
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    }
    catch (err) {
        return false;
    }
}
module.exports = { republishArticle: republishArticle, getRepublishedArticles: getRepublishedArticles, getFollowedPublishers: getFollowedPublishers, followPublisher: followPublisher, getfollowedPublishersNo: getfollowedPublishersNo, deleteWebsiteLink: deleteWebsiteLink, addWebsiteLink: addWebsiteLink, getAdvancerById: getAdvancerById, unFollowPublisher: unFollowPublisher };
