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
var notificationsModel = require('../models/notificationsModel');
var notificationsubscribersModel = require('../models/notificationSubscriberModel');
var notificationTypeModel = require('../models/notificationTypeModel');
var ObjectId = require('mongoose').Types.ObjectId;
//send the notification to the subscribers
var sendNotification = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, message, to, sentNotification, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, message = _a.message, to = _a.to;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, notificationsModel.create({
                        message: message,
                        to: to,
                    })];
            case 2:
                sentNotification = _b.sent();
                res.status(200).json({ 'status': true, sentNotification: sentNotification });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.status(400).json({ error: error_1.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
//get the list of notification
var getNotifications = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var typeId, isSubscriber, Notifications, error_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                typeId = req.body.typeId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                return [4 /*yield*/, notificationsubscribersModel.findOne({ userId: req.params.id, typeId: typeId })];
            case 2:
                isSubscriber = _a.sent();
                if (!isSubscriber) return [3 /*break*/, 7];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, notificationsModel.find({ typeId: typeId }).sort({ createdAt: -1 })];
            case 4:
                Notifications = _a.sent();
                res.status(200).json({ 'status': true, Notifications: Notifications });
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                res.status(400).json({ error: error_2.message });
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(400).json({ error: 'The user has not subscribed to these notifications' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_3 = _a.sent();
                res.status(400).json({ error: error_3.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
//subscribe to all notifications
var subscribeToNotifications = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, typeId, email, subscribe, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, typeId = _a.typeId, email = _a.email;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, notificationsubscribersModel.create({ userId: userId, email: email, typeId: typeId })];
            case 2:
                subscribe = _b.sent();
                if (subscribe) {
                    res.status(200).json({ 'status': true, subscribed: subscribe });
                }
                else {
                    res.status(400).json({ 'status': false, error: 'Error subscribe notifications' });
                }
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                res.status(400).json({ error: error_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
//unsubcribe to notifications
var unsubcribeToNotifications = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var typeId, isSubscriber, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                typeId = req.body.typeId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, notificationsubscribersModel.findOneAndDelete({ userId: req.params.id, typeId: typeId })];
            case 2:
                isSubscriber = _a.sent();
                res.status(200).json({ 'status': true, message: 'successfully unsubscribed to notifications' });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(400).json({ error: error_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
//notification type
var addNotificationType = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var notification, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, notificationTypeModel.create({
                        name: req.body.name,
                    })];
            case 1:
                notification = _a.sent();
                if (notification) {
                    res.status(200).json({ 'status': true, message: "notification type successfully added" });
                }
                else {
                    res.status(400).json({ 'status': false, error: 'Error uploading the notification type' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                res.status(400).json({ error: error_6.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//get notfication types
var getNotificationTypes = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, notificationTypeModel.find().sort({ createdAt: -1 })];
            case 1:
                query = _a.sent();
                if (!query) {
                    res.status(400).json({ 'status': false, error: "no notification type found" });
                }
                res.status(200).json({ 'status': true, 'categories': query });
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                res.status(400).json({ error: error_7.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//for many 
module.exports = {
    unsubcribeToNotifications: unsubcribeToNotifications,
    subscribeToNotifications: subscribeToNotifications,
    getNotifications: getNotifications,
    sendNotification: sendNotification,
    getNotificationTypes: getNotificationTypes,
    addNotificationType: addNotificationType
};
