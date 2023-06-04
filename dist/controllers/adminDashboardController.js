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
var User = require('../models/userModel');
var advancerProfile = require('../models/advancerModel');
var publisherProfile = require('../models/publisherModel');
var adminProfile = require('../models/adminModel');
var nodemailer = require('nodemailer');
var ObjectId = require('mongoose').Types.ObjectId;
//getPublishers 
var getPublishers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, publisherProfile.aggregate([
                        { $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'publisherInfo'
                            }
                        },
                        { $sort: { "createdAt": -1 } },
                        { $lookup: {
                                from: 'plans',
                                localField: 'planId',
                                foreignField: '_id',
                                as: 'planInfo'
                            }
                        }
                    ])];
            case 1:
                currentUser = _a.sent();
                if (!currentUser) {
                    res.status(400).json({ error: "users not found" });
                }
                res.status(200).json({ 'status': true, list: currentUser });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(400).json({ error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// getAdvancers
var getAdvancers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, advancerProfile.aggregate([
                        { $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'advancerInfo'
                            }
                        },
                        { $lookup: {
                                from: 'plans',
                                localField: 'planId',
                                foreignField: '_id',
                                as: 'planInfo'
                            }
                        }
                    ])];
            case 1:
                currentUser = _a.sent();
                if (!currentUser) {
                    res.status(400).json({ error: "users not found" });
                }
                res.status(200).json({ 'status': true, list: currentUser });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(400).json({ error: error_2.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// getAdvancers
var getAdmins = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, adminProfile.aggregate([
                        { $lookup: {
                                from: 'users',
                                localField: 'userId',
                                foreignField: '_id',
                                as: 'adminInfo'
                            }
                        }
                    ])];
            case 1:
                currentUser = _a.sent();
                if (!currentUser) {
                    res.status(400).json({ error: "users not found" });
                }
                res.status(200).json({ 'status': true, list: currentUser });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(400).json({ error: error_3.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// approve
var approvePublisher = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var document_1, currentUser, transporter, mailOptions, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, publisherProfile.findOneAndUpdate({ userId: req.params.id }, { status: 'approved' })];
            case 1:
                document_1 = _a.sent();
                return [4 /*yield*/, User.findById(req.params.id)];
            case 2:
                currentUser = _a.sent();
                if (ValidateEmail(currentUser.email)) {
                    try {
                        transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 587,
                            secure: false,
                            requireTLS: true,
                            auth: {
                                user: "noreply@minorityafrica.org",
                                pass: process.env.EMAILPASSWORD
                            }
                        });
                        mailOptions = {
                            from: 'noreply@minorityafrica.org',
                            to: currentUser.email,
                            subject: "Approval to become a publisher ",
                            html: "<p>Your Request to be a publisher on Minority Africa Advance has been approved, Please logout and Login to access the Publisher Dashboard<br/><br/><br/>The Advance Team</p>"
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                res.status(400).json({ status: false, error: error });
                            }
                            else {
                                res.status(200).json({ 'status': true, 'message': 'succefully approved publisher' });
                            }
                        });
                    }
                    catch (error) {
                        res.status(400).json({ status: false, error: error });
                    }
                }
                else {
                    res.status(400).json({ status: false, error: 'didnt find a valid email address but the the publisher is approved' });
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
//suspend advancer
var suspendAdvancer = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var document_2, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, advancerProfile.findOneAndUpdate({ userId: req.params.id }, { status: 'suspended' })];
            case 1:
                document_2 = _a.sent();
                res.status(200).json({ 'status': true, 'message': 'succefully suspended advancer' });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(400).json({ error: error_5.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// get admin profile info
var getAdminProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var currentUser, admin, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!ObjectId.isValid(req.params.id)) return [3 /*break*/, 8];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, User.findById(req.params.id).select('-password')];
            case 2:
                currentUser = _a.sent();
                if (!currentUser) return [3 /*break*/, 4];
                return [4 /*yield*/, adminProfile.find({ userId: currentUser._id })];
            case 3:
                admin = _a.sent();
                if (admin) {
                    res.status(200).json({ 'status': true, 'user': currentUser, 'admin Info': admin });
                }
                else {
                    res.status(400).json({ error: "user is not the admin" });
                }
                return [3 /*break*/, 5];
            case 4:
                res.status(400).json({ error: "user not found" });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_6 = _a.sent();
                res.status(400).json({ error: error_6.message });
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                res.status(400).json({ status: false, error: 'the provided user Id is invalid' });
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
// get admin profile info
var updateProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name, surname, location, phoneNumber, lowerCaseEmail, currentUser, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, name = _a.name, surname = _a.surname, location = _a.location, phoneNumber = _a.phoneNumber;
                if (!ObjectId.isValid(req.params.id)) return [3 /*break*/, 5];
                lowerCaseEmail = email.toLowerCase();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, User.findByIdAndUpdate(req.params.id, { name: name, surname: surname, email: lowerCaseEmail }).select('-password')];
            case 2:
                currentUser = _b.sent();
                if (currentUser) {
                    res.status(200).json({ 'status': true, 'user': { email: email, name: name, surname: surname, location: location, phoneNumber: phoneNumber }, message: 'successfully updated the user info' });
                }
                else {
                    res.status(400).json({ error: "user not found" });
                }
                return [3 /*break*/, 4];
            case 3:
                error_7 = _b.sent();
                res.status(400).json({ error: error_7.message });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ status: false, error: 'the provided user Id is invalid' });
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
//register admin
var addAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, phoneNumber, description, lowerCaseEmail, user, userExists, admin, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, phoneNumber = _a.phoneNumber, description = _a.description;
                lowerCaseEmail = email.toLowerCase();
                return [4 /*yield*/, User.findOne({ email: lowerCaseEmail })];
            case 1:
                user = _b.sent();
                if (!user) return [3 /*break*/, 7];
                return [4 /*yield*/, adminProfile.findOne({ userId: user.id })];
            case 2:
                userExists = _b.sent();
                if (!userExists) return [3 /*break*/, 3];
                res.status(400).json({ status: false, error: 'already registered as a admin', userExists: userExists });
                return [3 /*break*/, 6];
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, adminProfile.create({ userId: user._id,
                        phoneNumber: phoneNumber,
                        location: user.countryCode,
                        description: description
                    })];
            case 4:
                admin = _b.sent();
                res.status(200).
                    json({ status: true, admin: admin });
                return [3 /*break*/, 6];
            case 5:
                error_8 = _b.sent();
                res.status(400).json({ status: false, error: error_8.message });
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(400).json({ status: false, error: 'The user is not registered in the system' });
                _b.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
// revoke
var revokePublisher = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var document_3, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, publisherProfile.findOneAndUpdate({ userId: req.params.id }, { status: 'rejected' })];
            case 1:
                document_3 = _a.sent();
                res.status(200).json({ 'status': true, 'message': 'succefully approved publisher' });
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                res.status(400).json({ error: error_9.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//switching to the publisher profile
var switchToPublisher = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_1, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, publisherProfile.findOne({ userId: req.params.id })];
            case 1:
                user_1 = _a.sent();
                if (user_1) {
                    res.status(200).json({ 'status': true, 'message': "is publisher" });
                }
                else {
                    res.status(400).json({ 'status': false, 'message': 'not publisher' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                res.status(400).json({ error: error_10.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//switching to the admin profile
var switchToAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_2, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, adminProfile.findOne({ userId: req.params.id })];
            case 1:
                user_2 = _a.sent();
                if (user_2) {
                    res.status(200).json({ 'status': true, 'message': "is admin" });
                }
                else {
                    res.status(400).json({ 'status': false, 'message': 'not admin' });
                }
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                res.status(400).json({ error: error_11.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// make super admin
var makeSuperAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var document_4, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, adminProfile.findOneAndUpdate({ userId: req.params.id }, { isSuperAdmin: true })];
            case 1:
                document_4 = _a.sent();
                res.status(200).json({ 'status': true, 'message': 'succefully made the admin a super admin' });
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                res.status(400).json({ error: error_12.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// sendEmailTo
var sendEmailTo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, recieverMail, message, subject, transporter, mailOptions;
    return __generator(this, function (_b) {
        _a = req.body, recieverMail = _a.recieverMail, message = _a.message, subject = _a.subject;
        if (ValidateEmail(recieverMail)) {
            try {
                transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: "noreply@minorityafrica.org",
                        pass: process.env.EMAILPASSWORD
                    }
                });
                mailOptions = {
                    from: 'noreply@minorityafrica.org',
                    to: recieverMail,
                    subject: subject,
                    html: '<p>' + message + '</p>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.status(400).json({ status: false, error: error });
                    }
                    else {
                        res.status(200).json({ status: true, message: 'message has been sent' });
                    }
                });
            }
            catch (error) {
                res.status(400).json({ status: false, error: error });
            }
        }
        else {
            res.status(400).json({ status: false, error: 'your email address is not valid' });
        }
        return [2 /*return*/];
    });
}); };
// sendEmailTo
var sendPublisherApprovalEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, recieverMail, message, subject, transporter, mailOptions;
    return __generator(this, function (_b) {
        _a = req.body, recieverMail = _a.recieverMail, message = _a.message, subject = _a.subject;
        if (ValidateEmail(recieverMail)) {
            try {
                transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: "noreply@minorityafrica.org",
                        pass: process.env.EMAILPASSWORD
                    }
                });
                mailOptions = {
                    from: 'noreply@minorityafrica.org',
                    to: recieverMail,
                    subject: "Approval to become a publisher ",
                    html: "<p>Your Request to be a publisher on Minority Africa Advance has been approved, Please logout and Login to access the Publisher Dashboard<br/><br/><br/>The Advance Team</p>"
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        res.status(400).json({ status: false, error: error });
                    }
                    else {
                        res.status(200).json({ status: true, message: 'message has been sent' });
                    }
                });
            }
            catch (error) {
                res.status(400).json({ status: false, error: error });
            }
        }
        else {
            res.status(400).json({ status: false, error: 'your email address is not valid' });
        }
        return [2 /*return*/];
    });
}); };
// validate email
function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.match(mailformat)) {
        return true;
    }
    else {
        return false;
    }
}
//for many
module.exports = {
    getAdvancers: getAdvancers,
    getPublishers: getPublishers,
    approvePublisher: approvePublisher,
    revokePublisher: revokePublisher,
    sendEmailTo: sendEmailTo,
    switchToPublisher: switchToPublisher,
    getAdmins: getAdmins,
    getAdminProfile: getAdminProfile,
    updateProfile: updateProfile,
    addAdmin: addAdmin,
    makeSuperAdmin: makeSuperAdmin,
    switchToAdmin: switchToAdmin,
    suspendAdvancer: suspendAdvancer
};
