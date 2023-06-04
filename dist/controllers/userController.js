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
var adminProfile = require('../models/adminModel');
var publisherProfile = require('../models/publisherModel');
var profilePic = require('../models/profilePicModel');
var planModel = require('../models/planModel');
var MediaModel = require('../models/mediaModel');
var articleModel = require('../models/articleModel');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var passwordStrength = require('check-password-strength').passwordStrength;
var nodemailer = require('nodemailer');
var storage_blob_1 = require("@azure/storage-blob");
var dotenv_1 = require("dotenv");
var randomString = require("randomstring");
var google_auth_library_1 = require("google-auth-library");
var ObjectId = require('mongoose').Types.ObjectId;
(0, dotenv_1.config)();
//uploading the images to azure blob
var BlobService = storage_blob_1.BlobServiceClient.fromConnectionString("".concat(process.env.AZURE_STORAGE_CONNECTION_STRING));
var clientId = "".concat(process.env.GOOGLE_CLIENT_ID);
var clientSecret = "".concat(process.env.GOOGLE_CLIENT_SECRET);
var googleClient = new google_auth_library_1.OAuth2Client({
    clientId: clientId,
    clientSecret: clientSecret
});
//returns tokens
var GetGoogleTokens = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tokens, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, googleClient.getToken(req.body.code)];
            case 1:
                tokens = (_a.sent()).tokens;
                console.log(tokens);
                res.status(200).json(tokens);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(400).json(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//returns credentials
var GetGoogleCredentials = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_1, credentials, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_1 = new google_auth_library_1.UserRefreshClient(clientId, clientSecret, req.body.refreshToken);
                return [4 /*yield*/, user_1.refreshAccessToken()];
            case 1:
                credentials = (_a.sent()).credentials;
                res.status(200).json(credentials);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(400).json(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var authenticateGoogleUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, ticket, payload, user_2, freeplan, Regadvancer, admin, advancer, publisher, isAdmin, isAdvancer, isPublisher, role, transporter, mailOptions, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.body.token;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 12, , 13]);
                return [4 /*yield*/, googleClient.verifyIdToken({
                        idToken: token,
                        audience: "".concat(process.env.GOOGLE_CLIENT_ID),
                    })];
            case 2:
                ticket = _a.sent();
                payload = ticket.getPayload();
                return [4 /*yield*/, User.findOne({ email: payload === null || payload === void 0 ? void 0 : payload.email })];
            case 3:
                user_2 = _a.sent();
                if (!!user_2) return [3 /*break*/, 11];
                return [4 /*yield*/, new User({
                        email: payload === null || payload === void 0 ? void 0 : payload.email,
                        surname: payload === null || payload === void 0 ? void 0 : payload.family_name,
                        name: payload === null || payload === void 0 ? void 0 : payload.name,
                        countryCode: payload === null || payload === void 0 ? void 0 : payload.locale,
                        profilePicture: { name: payload === null || payload === void 0 ? void 0 : payload.picture },
                        provider: 1,
                    })];
            case 4:
                user_2 = _a.sent();
                return [4 /*yield*/, user_2.save()];
            case 5:
                _a.sent();
                return [4 /*yield*/, planModel.findOne({ planName: 'Free Plan' })];
            case 6:
                freeplan = _a.sent();
                return [4 /*yield*/, advancerProfile.create({ userId: user_2._id, planId: freeplan._id })];
            case 7:
                Regadvancer = _a.sent();
                return [4 /*yield*/, adminProfile.findOne({ userId: user_2._id })];
            case 8:
                admin = _a.sent();
                return [4 /*yield*/, advancerProfile.findOne({ userId: user_2._id })];
            case 9:
                advancer = _a.sent();
                return [4 /*yield*/, publisherProfile.findOne({ userId: user_2._id })];
            case 10:
                publisher = _a.sent();
                isAdmin = admin ? true : false;
                isAdvancer = advancer ? true : false;
                isPublisher = publisher ? true : false;
                role = {
                    admin: isAdmin,
                    publisher: isPublisher,
                    advancer: isAdvancer
                };
                res.status(200).json({ 'status': true, AutToken: generateToken(user_2._id, user_2.name, user_2.surname, user_2.email, user_2.countryCode, role, user_2.profilePicture), user: { userId: user_2._id, firstName: user_2.name,
                        lastName: user_2.name, email: user_2.email, countryCode: user_2.countryCode, role: role } });
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
                        to: payload === null || payload === void 0 ? void 0 : payload.email,
                        subject: 'Welcome to Advance',
                        html: '<p>Hi ' + (payload === null || payload === void 0 ? void 0 : payload.name) + ', Welcome to Advance, We are happy that you decided to join us on a journey to make Minority Voices be heard across Africa</p><br/><br/><p>The Advance team</p>'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('message has been sent', info.response);
                        }
                    });
                }
                catch (error) {
                    res.status(400).json({ status: false, error: error.message });
                }
                _a.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                error_3 = _a.sent();
                res.status(400).json({ error: error_3.message });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
//send mail
var sendMail = function (to, subject, html) { return __awaiter(void 0, void 0, void 0, function () {
    var transporter, mailOptions;
    return __generator(this, function (_a) {
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
                to: to,
                subject: subject,
                html: html
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return false;
                }
                else {
                    console.log('message has been sent', info.response);
                    return true;
                }
            });
        }
        catch (error) {
            console.log(error.message);
            return [2 /*return*/, false];
        }
        return [2 /*return*/];
    });
}); };
// update user password
var updatePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, currentPassword, newPassword, user_3, _b, salt, Hashedpassword, document_1, error_4, error_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 14, , 15]);
                return [4 /*yield*/, User.findById(req.params.id)];
            case 2:
                user_3 = _c.sent();
                _b = user_3;
                if (!_b) return [3 /*break*/, 4];
                return [4 /*yield*/, bcrypt.compare(currentPassword, user_3.password)];
            case 3:
                _b = (_c.sent());
                _c.label = 4;
            case 4:
                if (!_b) return [3 /*break*/, 12];
                if (!(passwordStrength(newPassword).value === 'Too weak' || passwordStrength(newPassword).value === 'Weak')) return [3 /*break*/, 5];
                res.status(400).
                    json({
                    'status': false,
                    error: 'Your password is weak,It must be atleast 8 charecters and contain lowercase, uppercase, symbol and/or number'
                });
                return [3 /*break*/, 11];
            case 5:
                if (!(currentPassword === newPassword)) return [3 /*break*/, 6];
                res.status(400).
                    json({
                    'status': false,
                    error: 'You can not update the password with the same password, please enter a different password'
                });
                return [3 /*break*/, 11];
            case 6:
                _c.trys.push([6, 10, , 11]);
                return [4 /*yield*/, bcrypt.genSalt(10)];
            case 7:
                salt = _c.sent();
                return [4 /*yield*/, bcrypt.hash(newPassword, salt)];
            case 8:
                Hashedpassword = _c.sent();
                return [4 /*yield*/, User.findByIdAndUpdate(req.params.id, { password: Hashedpassword })];
            case 9:
                document_1 = _c.sent();
                res.status(200).json({ 'status': true, 'message': 'successfully updated the password' });
                return [3 /*break*/, 11];
            case 10:
                error_4 = _c.sent();
                res.status(400).json({ error: error_4.message });
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 13];
            case 12:
                res.status(400).json({ message: "current password is incorrect, please use the correct password" });
                _c.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                error_5 = _c.sent();
                res.status(400).json({ error: error_5.message });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); };
//log in 
var logIn = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, password, email, lowerCaseEmail, user_4, _b, admin, advancer, publisher, isAdmin, isAdvancer, isPublisher, role, error_6;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, password = _a.password, email = _a.email;
                if (!(!email || !password)) return [3 /*break*/, 1];
                res.status(400).json({ status: false, error: 'please add all fields' });
                return [3 /*break*/, 15];
            case 1:
                if (!(passwordStrength(password).value === 'Too weak' || passwordStrength(password).value === 'Weak')) return [3 /*break*/, 2];
                res.status(400).json({ 'status': false, error: 'Your password is weak,it must be atleast 8 charecters and contain lowercase, uppercase, symbol and/or number' });
                return [3 /*break*/, 15];
            case 2:
                if (!!ValidateEmail(email)) return [3 /*break*/, 3];
                res.status(400).json({ status: false, error: 'your email address is not valid' });
                return [3 /*break*/, 15];
            case 3:
                _c.trys.push([3, 14, , 15]);
                lowerCaseEmail = email.toLowerCase();
                return [4 /*yield*/, User.findOne({ email: lowerCaseEmail })];
            case 4:
                user_4 = _c.sent();
                if (!user_4) return [3 /*break*/, 12];
                _b = user_4;
                if (!_b) return [3 /*break*/, 6];
                return [4 /*yield*/, bcrypt.compare(password, user_4.password)];
            case 5:
                _b = (_c.sent());
                _c.label = 6;
            case 6:
                if (!_b) return [3 /*break*/, 10];
                return [4 /*yield*/, adminProfile.findOne({ userId: user_4._id })];
            case 7:
                admin = _c.sent();
                return [4 /*yield*/, advancerProfile.findOne({ userId: user_4._id })];
            case 8:
                advancer = _c.sent();
                return [4 /*yield*/, publisherProfile.findOne({ userId: user_4._id })];
            case 9:
                publisher = _c.sent();
                isAdmin = admin ? true : false;
                isAdvancer = advancer ? true : false;
                isPublisher = publisher ? true : false;
                role = {
                    admin: isAdmin,
                    publisher: isPublisher,
                    advancer: isAdvancer
                };
                res.status(200).json({
                    'status': true,
                    'message': 'succefull',
                    token: generateToken(user_4._id, user_4.name, user_4.surname, user_4.email, user_4.countryCode, role, user_4.profilePicture),
                    userId: user_4.id,
                    email: user_4.email,
                    name: user_4.name,
                    surname: user_4.surname,
                    countryCode: user_4.countryCode,
                    isAccountDeactivated: user_4.isAccountDeactivated,
                    admin: isAdmin,
                    publisher: isAdvancer,
                    advancer: isPublisher
                });
                return [3 /*break*/, 11];
            case 10:
                res.status(400).json({ 'status': false, error: 'Invalid user credentials' });
                _c.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                res.status(400).json({ 'status': false, error: 'User not found, please register before trying to login' });
                _c.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                error_6 = _c.sent();
                res.status(400).json({ error: error_6.message });
                return [3 /*break*/, 15];
            case 15: return [2 /*return*/];
        }
    });
}); };
// register user
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, name, surname, password, countryCode, lowerCaseEmail, userExists, salt, Hashedpassword, user_5, freeplan, Regadvancer, admin, advancer, publisher, isAdmin, isAdvancer, isPublisher, role, transporter, mailOptions, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, name = _a.name, surname = _a.surname, password = _a.password, countryCode = _a.countryCode;
                if (!(!name || !surname || !email || !password || !countryCode)) return [3 /*break*/, 1];
                res.status(400).json({ status: false, error: 'please add all fields' });
                return [3 /*break*/, 17];
            case 1:
                if (!ValidateEmail(email)) return [3 /*break*/, 16];
                lowerCaseEmail = email.toLowerCase();
                if (!(passwordStrength(password).value === 'Too weak' || passwordStrength(password).value === 'Weak')) return [3 /*break*/, 2];
                res.status(400).
                    json({
                    'status': false,
                    error: 'Your password is weak,It must be atleast 8 characters and contain lowercase, uppercase, symbol and/or number'
                });
                return [3 /*break*/, 15];
            case 2: return [4 /*yield*/, User.findOne({ email: lowerCaseEmail })];
            case 3:
                userExists = _b.sent();
                if (!userExists) return [3 /*break*/, 4];
                res.status(400).json({ status: false, error: 'user already exists' });
                return [3 /*break*/, 15];
            case 4: return [4 /*yield*/, bcrypt.genSalt(10)];
            case 5:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt.hash(password, salt)];
            case 6:
                Hashedpassword = _b.sent();
                _b.label = 7;
            case 7:
                _b.trys.push([7, 14, , 15]);
                return [4 /*yield*/, User.create({ name: name, surname: surname, email: lowerCaseEmail, password: Hashedpassword, countryCode: countryCode })];
            case 8:
                user_5 = _b.sent();
                return [4 /*yield*/, planModel.findOne({ planName: 'Free Plan' })];
            case 9:
                freeplan = _b.sent();
                return [4 /*yield*/, advancerProfile.create({ userId: user_5._id, planId: freeplan._id })];
            case 10:
                Regadvancer = _b.sent();
                return [4 /*yield*/, adminProfile.findOne({ userId: user_5._id })];
            case 11:
                admin = _b.sent();
                return [4 /*yield*/, advancerProfile.findOne({ userId: user_5._id })];
            case 12:
                advancer = _b.sent();
                return [4 /*yield*/, publisherProfile.findOne({ userId: user_5._id })];
            case 13:
                publisher = _b.sent();
                isAdmin = admin ? true : false;
                isAdvancer = advancer ? true : false;
                isPublisher = publisher ? true : false;
                role = {
                    admin: isAdmin,
                    publisher: isPublisher,
                    advancer: isAdvancer
                };
                res.status(200).
                    json({ status: true,
                    token: generateToken(user_5._id, user_5.name, user_5.surname, user_5.email, user_5.countryCode, role, user_5.profilePicture),
                    email: user_5.email,
                    name: user_5.name,
                    surname: user_5.surname,
                    countryCode: user_5.countryCode });
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
                        to: email,
                        subject: 'Welcome to Advance',
                        html: '<p>Hi ' + name + ', Welcome to Advance, We are happy that you decided to join us on a journey to make Minority Voices be heard across Africa</p><br/><br/><p>The Advance team</p>'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('message has been sent', info.response);
                        }
                    });
                }
                catch (error) {
                    res.status(400).json({ status: false, error: error.message });
                }
                return [3 /*break*/, 15];
            case 14:
                error_7 = _b.sent();
                res.status(400).json({ status: false, error: error_7.message });
                return [3 /*break*/, 15];
            case 15: return [3 /*break*/, 17];
            case 16:
                res.status(400).json({ status: false, error: 'your email address is not valid' });
                _b.label = 17;
            case 17: return [2 /*return*/];
        }
    });
}); };
// register publisher
var registerPublisher = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, organisation, userExists, freeplan, publisher, toEmail, subject, html, error_8, error_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, organisation = _a.organisation;
                if (!ObjectId.isValid(userId)) return [3 /*break*/, 12];
                return [4 /*yield*/, publisherProfile.findOne({ userId: userId })];
            case 1:
                userExists = _b.sent();
                if (!userExists) return [3 /*break*/, 2];
                res.status(400).json({ status: false, error: 'already registered as a publisher' });
                return [3 /*break*/, 11];
            case 2:
                _b.trys.push([2, 10, , 11]);
                return [4 /*yield*/, planModel.findOne({ planName: 'Free Plan' })];
            case 3:
                freeplan = _b.sent();
                if (!freeplan) return [3 /*break*/, 8];
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, publisherProfile.create({ userId: userId, planId: freeplan._id, organisation: organisation })];
            case 5:
                publisher = _b.sent();
                toEmail = "advance@minorityafrica.org";
                subject = "New Publisher Registration Application";
                html = '<p>Dear Advance Admin. ' + userExists.name + ' ' + userExists.surme + ', has just applied to be a publisher, Login to your Admin Dashboard now to approve the request</p><br/><p> Thanks</p>';
                sendMail(toEmail, subject, html);
                res.status(200).
                    json({ status: true, publisher: publisher });
                return [3 /*break*/, 7];
            case 6:
                error_8 = _b.sent();
                res.status(400).json({ status: false, error: error_8.message });
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                res.status(400).json({ status: false, error: "The plan has not been added yet" });
                _b.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_9 = _b.sent();
                res.status(400).json({ status: false, error: error_9.message });
                return [3 /*break*/, 11];
            case 11: return [3 /*break*/, 13];
            case 12:
                res.status(400).json({ status: false, error: 'the provided user Id is invalid' });
                _b.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); };
//register advancer
var updateAdvancerProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, company, website, planId, applicationPassword, wordpressAdminName, advancer, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, company = _a.company, website = _a.website, planId = _a.planId, applicationPassword = _a.applicationPassword, wordpressAdminName = _a.wordpressAdminName;
                if (!ObjectId.isValid(userId)) return [3 /*break*/, 5];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, advancerProfile.findOneAndUpdate({ userId: userId }, { planId: planId, company: company, website: website, applicationPassword: applicationPassword, wordpressAdminName: wordpressAdminName })];
            case 2:
                advancer = _b.sent();
                res.status(200).json({ 'status': true, advancer: advancer });
                return [3 /*break*/, 4];
            case 3:
                error_10 = _b.sent();
                res.status(400).json({ status: false, error: error_10.message });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ status: false, error: 'the provided user Id is invalid' });
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
//upload any media file
var uploadMedia = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var containersArray, _a, container, id, _b, originalname, buffer, containerClient, uniqueName, pic, pic, pic, error_11;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                containersArray = ['profile-pictures', 'article-images', 'article-videos', "article-content"];
                _a = req.body, container = _a.container, id = _a.id;
                _b = req.file, originalname = _b.originalname, buffer = _b.buffer;
                if (!containersArray.includes(container)) return [3 /*break*/, 11];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 9, , 10]);
                containerClient = BlobService.getContainerClient(container);
                uniqueName = id + "/" + Date.now() + "/" + originalname;
                return [4 /*yield*/, containerClient.getBlockBlobClient(uniqueName).uploadData(buffer)];
            case 2:
                _c.sent();
                if (!(container === 'profile-pictures')) return [3 /*break*/, 4];
                return [4 /*yield*/, User.findByIdAndUpdate(id, { $push: { "profilePicture": { name: uniqueName } } })];
            case 3:
                pic = _c.sent();
                res.status(200).json({ 'status': true, message: "Profile picture successfully added" })
                    .catch(function (err) { return res.status(400).json({ error: err.message }); });
                return [3 /*break*/, 8];
            case 4:
                if (!(container === 'article-content')) return [3 /*break*/, 6];
                return [4 /*yield*/, articleModel.findByIdAndUpdate(id, { $push: { "articleContent": {
                                name: uniqueName
                            } } })];
            case 5:
                pic = _c.sent();
                res.status(200).json({ 'status': true, message: "Article media successfully added" })
                    .catch(function (err) { return res.status(400).json({ error: err.message }); });
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, articleModel.findByIdAndUpdate(id, { $push: { "articleMedia": {
                            name: uniqueName
                        } } })];
            case 7:
                pic = _c.sent();
                res.status(200).json({ 'status': true, message: "Article media successfully added" })
                    .catch(function (err) { return res.status(400).json({ error: err.message }); });
                _c.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                error_11 = _c.sent();
                res.status(400).json({ error: error_11.message });
                return [3 /*break*/, 10];
            case 10: return [3 /*break*/, 12];
            case 11:
                res.status(400).json({ error: 'choosen container is invalid, choose from (profile-pictures,article-images,article-videos,article-content)' });
                _c.label = 12;
            case 12: return [2 /*return*/];
        }
    });
}); };
var getUploadedMedia = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var containersArray, _a, container, id, containerClient, filename, response, error_12, filename, response, error_13, error_14;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                containersArray = ['profile-pictures', 'article-images', 'article-videos', "article-content"];
                _a = req.params, container = _a.container, id = _a.id;
                if (!containersArray.includes(container)) return [3 /*break*/, 18];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 16, , 17]);
                containerClient = BlobService.getContainerClient(container);
                res.header("Content-Type", "image/jpg");
                if (!(container === 'profile-pictures')) return [3 /*break*/, 9];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 7, , 8]);
                return [4 /*yield*/, profilePic.findOne({ userId: id })];
            case 3:
                filename = _b.sent();
                if (!filename) return [3 /*break*/, 5];
                return [4 /*yield*/, containerClient.getBlockBlobClient(filename.name).downloadToBuffer()];
            case 4:
                response = _b.sent();
                res.status(200).send(response);
                return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ error: 'file not found' });
                _b.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_12 = _b.sent();
                res.status(400).json({ error: error_12.message });
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 15];
            case 9:
                _b.trys.push([9, 14, , 15]);
                return [4 /*yield*/, MediaModel.findOne({ articleId: id })];
            case 10:
                filename = _b.sent();
                if (!filename) return [3 /*break*/, 12];
                return [4 /*yield*/, containerClient.getBlockBlobClient(filename.name).downloadToBuffer()];
            case 11:
                response = _b.sent();
                res.status(200).send(response);
                return [3 /*break*/, 13];
            case 12:
                res.status(400).json({ error: 'file not found' });
                _b.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                error_13 = _b.sent();
                res.status(400).json({ error: error_13.message });
                return [3 /*break*/, 15];
            case 15: return [3 /*break*/, 17];
            case 16:
                error_14 = _b.sent();
                res.status(400).json({ error: error_14.message });
                return [3 /*break*/, 17];
            case 17: return [3 /*break*/, 19];
            case 18:
                res.status(400).json({ error: 'choosen container is invalid, choose from (profile-pictures,article-images,article-videos,article-content)' });
                _b.label = 19;
            case 19: return [2 /*return*/];
        }
    });
}); };
//delete uploaded media
var deleteUploadedMedia = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var containersArray, _a, container, filename, id, containerClient, response, pic, pic, pic, error_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                containersArray = ['profile-pictures', 'article-images', 'article-videos', "article-content"];
                _a = req.params, container = _a.container, filename = _a.filename, id = _a.id;
                if (!containersArray.includes(container)) return [3 /*break*/, 5];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                containerClient = BlobService.getContainerClient(container);
                return [4 /*yield*/, containerClient.getBlockBlobClient(filename).deleteIfExists()];
            case 2:
                response = _b.sent();
                if (container === 'profile-pictures') {
                    pic = profilePic.findByIdAndUpdate(id, { $pull: { 'profilePicture': { name: filename } } });
                    pic.save().then(function () { return res.status(200).json({ 'status': true, message: "Profile picture successfully deleted" }); })
                        .catch(function (err) { return res.status(400).json({ error: err.message }); });
                }
                else if (container === 'article-content') {
                    pic = articleModel.findAndUpdate(id, { $pull: { 'articleContent': { name: filename } } });
                    pic.save().then(function () { return res.status(200).json({ 'status': true, message: "Article content successfully deleted" }); })
                        .catch(function (err) { return res.status(400).json({ error: err.message }); });
                }
                else {
                    pic = articleModel.findByIdAndUpdate(id, { $pull: { 'articleMedia': { name: filename } } });
                    pic.save().then(function () { return res.status(200).json({ 'status': true, message: "Article media successfully deleted" }); })
                        .catch(function (err) { return res.status(400).json({ error: err.message }); });
                }
                return [3 /*break*/, 4];
            case 3:
                error_15 = _b.sent();
                res.status(400).json({ error: error_15.message });
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ error: 'choosen container is invalid, choose from (profile-pictures,article-images,article-videos,article-content)' });
                _b.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
//update uploaded media
var updateUploadedMedia = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var containersArray, _a, container, filename, id, _b, originalname, buffer, containerClient, uniqueName, upload, response, pic, pic, pic, error_16;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                containersArray = ['profile-pictures', 'article-images', 'article-videos'];
                _a = req.params, container = _a.container, filename = _a.filename, id = _a.id;
                _b = req.file, originalname = _b.originalname, buffer = _b.buffer;
                if (!containersArray.includes(container)) return [3 /*break*/, 6];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                containerClient = BlobService.getContainerClient(container);
                uniqueName = id + "/" + Date.now() + "/" + originalname;
                return [4 /*yield*/, containerClient.getBlockBlobClient(uniqueName).uploadData(buffer)];
            case 2:
                upload = _c.sent();
                return [4 /*yield*/, containerClient.getBlockBlobClient(filename).deleteIfExists()];
            case 3:
                response = _c.sent();
                if (container === 'profile-pictures') {
                    pic = profilePic.findByIdAndUpdate(id, { $set: { "profilePicture.$.name": uniqueName } });
                    pic.save().then(function () { return res.status(200).json({ 'status': true, message: "Profile picture successfully deleted" }); })
                        .catch(function (err) { return res.status(400).json({ error: err.message }); });
                }
                else if (container === 'article-content') {
                    pic = articleModel.findOneAndUpdate({ _id: id, "articleContent.$.name": filename }, { $set: { "articleContent.$.name": uniqueName } });
                    pic.save().then(function () { return res.status(200).json({ 'status': true, message: "Article media successfully edited" }); })
                        .catch(function (err) { return res.status(400).json({ error: err.message }); });
                }
                else {
                    pic = articleModel.findByIdAndUpdate(id, { $set: { "articleMedia.$.name": uniqueName } });
                    pic.save().then(function () { return res.status(200).json({ 'status': true, message: "Article media successfully edited" }); })
                        .catch(function (err) { return res.status(400).json({ error: err.message }); });
                }
                return [3 /*break*/, 5];
            case 4:
                error_16 = _c.sent();
                res.status(400).json({ error: error_16.message });
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                res.status(400).json({ error: 'choosen container is invalid, choose from (profile-pictures,article-images,article-videos,article-content)' });
                _c.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
//Forgot password
var forgotPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, lowerCaseEmail, currentUser, val, generatedString, data, subject, html, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                lowerCaseEmail = email.toLowerCase();
                return [4 /*yield*/, User.findOne({ email: lowerCaseEmail })];
            case 2:
                currentUser = _a.sent();
                if (!currentUser) return [3 /*break*/, 4];
                val = Math.floor(1000 + Math.random() * 9000);
                generatedString = val.toString();
                return [4 /*yield*/, User.updateOne({ email: lowerCaseEmail }, { $set: { passwordResetToken: generatedString } })];
            case 3:
                data = _a.sent();
                subject = 'Reset password';
                html = '<p>Hi ' + currentUser.name + ', You have requested to change your password. Here is the token, use it to reset your password:</p><a> ' + generatedString + '</a>';
                sendMail(lowerCaseEmail, subject, html);
                res.status(200).json({ status: true, message: 'please check your email inbox to complete the process' });
                return [3 /*break*/, 5];
            case 4:
                res.status(400).json({ status: false, error: 'This email does not exist' });
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_17 = _a.sent();
                res.status(400).json({ status: false, error: error_17.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
// deactivate admin account
var deactivateAccount = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, password, role, user_6, _b, error_18;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, password = _a.password, role = _a.role;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                return [4 /*yield*/, User.findById(req.params.id)];
            case 2:
                user_6 = _c.sent();
                _b = user_6;
                if (!_b) return [3 /*break*/, 4];
                return [4 /*yield*/, bcrypt.compare(password, user_6.password)];
            case 3:
                _b = (_c.sent());
                _c.label = 4;
            case 4:
                if (_b) {
                    User.findByIdAndUpdate(req.params.id, { isAccountDeactivated: true }, function (err, admin) {
                        if (err) {
                            res.status(400).json({ error: err.message });
                        }
                        else {
                            var lowerCaseEmail = user_6.email.toLowerCase();
                            var subject = 'Deactivating Account';
                            var html = '<p>Hi ' + user_6.name + ', Your account has been deactivated, you are now an advancer, You will need to re apply to become a ' + role + '</p>';
                            sendMail(lowerCaseEmail, subject, html);
                            res.status(200).json({ status: true, success: 'successfully deactivated account', user: user_6 });
                        }
                    });
                }
                else {
                    res.status(400).json({ message: "password is incorrect, please use the correct password" });
                }
                return [3 /*break*/, 6];
            case 5:
                error_18 = _c.sent();
                res.status(400).json({ error: error_18.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
// send contact us email to minority africa
var sendContactUsEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, Fistname, Lastname, email, Content, toEmail, subject, html, sendEmail;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, Fistname = _a.Fistname, Lastname = _a.Lastname, email = _a.email, Content = _a.Content;
                if (!ValidateEmail(email)) return [3 /*break*/, 2];
                toEmail = "advance@minorityafrica.org";
                subject = 'New message from Advance';
                html = '<h4>' + Fistname + ' ' + Lastname + '</h4><a href="mailto:"' + email + '>Email address: ' + email + '</a></br><p>' + Content + '</p>';
                return [4 /*yield*/, sendMail(toEmail, subject, html)];
            case 1:
                sendEmail = _b.sent();
                res.status(200).json({ message: 'message has been sent' });
                return [3 /*break*/, 3];
            case 2:
                res.status(400).json({ error: 'invalid email address' });
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// send news letter email to minority africa
var subscribeToNewsLetterEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, toEmail, subject, html, sendEmail;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                if (!ValidateEmail(email)) return [3 /*break*/, 2];
                toEmail = "advance@minorityafrica.org";
                subject = 'New subscriber to news letters';
                html = '</h4><a href="mailto:"' + email + '>Email address: ' + email;
                return [4 /*yield*/, sendMail(toEmail, subject, html)];
            case 1:
                sendEmail = _a.sent();
                res.status(200).json({ message: 'message has been sent' });
                return [3 /*break*/, 3];
            case 2:
                res.status(400).json({ error: 'invalid email address' });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// deactivate admin account
var sendDeleteAccountToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, lowerCaseEmail, currentUser, val, generatedString, data, subject, html, sendEmail, error_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                lowerCaseEmail = email.toLowerCase();
                return [4 /*yield*/, User.findOne({ email: lowerCaseEmail })];
            case 2:
                currentUser = _a.sent();
                if (!currentUser) return [3 /*break*/, 5];
                val = Math.floor(1000 + Math.random() * 9000);
                generatedString = val.toString();
                return [4 /*yield*/, User.updateOne({ email: lowerCaseEmail }, { $set: { deleteAccountToken: generatedString } })];
            case 3:
                data = _a.sent();
                subject = 'Delete Account';
                html = '<p>Hi ' + currentUser.name + ', You have requested to delete your account. Here is the token, use it to delete your account:</p><a> ' + generatedString + '</a>';
                return [4 /*yield*/, sendMail(lowerCaseEmail, subject, html)];
            case 4:
                sendEmail = _a.sent();
                res.status(200).json({ status: true, message: 'please check your email inbox to complete the process' });
                return [3 /*break*/, 6];
            case 5:
                res.status(400).json({ status: false, error: 'This email does not exist' });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                error_19 = _a.sent();
                res.status(400).json({ status: false, error: error_19.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
// deactivate admin account
var deleteAccount = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, tokenData, deleteAcc, error_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                token = req.query.token;
                return [4 /*yield*/, User.findOne({ deleteAccountToken: token })];
            case 1:
                tokenData = _a.sent();
                if (!tokenData) return [3 /*break*/, 3];
                return [4 /*yield*/, User.findByIdAndDelete({ _id: tokenData._id })];
            case 2:
                deleteAcc = _a.sent();
                res.status(200).json({ status: true, message: 'User deleted successfully' });
                return [3 /*break*/, 4];
            case 3:
                res.status(400).json({ status: false, error: 'The token is invalid' });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_20 = _a.sent();
                res.status(400).json({ status: false, error: error_20.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
//reset password
var resetPassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var password, token, tokenData, salt, NewHashedpassword, setPassword, error_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                password = req.body.password;
                if (!(passwordStrength(password).value === 'Too weak' || passwordStrength(password).value === 'Weak')) return [3 /*break*/, 1];
                res.status(400).json({ 'status': false, error: 'Your password is weak,it must be atleast 8 charecters and contain lowercase, uppercase, symbol and/or number' });
                return [3 /*break*/, 9];
            case 1:
                _a.trys.push([1, 8, , 9]);
                token = req.query.token;
                return [4 /*yield*/, User.findOne({ passwordResetToken: token })];
            case 2:
                tokenData = _a.sent();
                if (!tokenData) return [3 /*break*/, 6];
                return [4 /*yield*/, bcrypt.genSalt(10)];
            case 3:
                salt = _a.sent();
                return [4 /*yield*/, bcrypt.hash(password, salt)];
            case 4:
                NewHashedpassword = _a.sent();
                return [4 /*yield*/, User.findByIdAndUpdate({ _id: tokenData._id }, { $set: { password: NewHashedpassword, passwordResetToken: "" } }, { new: true })];
            case 5:
                setPassword = _a.sent();
                res.status(200).json({ status: true, message: 'User password has been reset successfully', data: setPassword });
                return [3 /*break*/, 7];
            case 6:
                res.status(400).json({ status: false, error: 'The token is invalid' });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_21 = _a.sent();
                res.status(400).json({ status: false, error: error_21.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
// 
var welcome = function (req, res) {
    res.status(200).json({ status: true, error: 'welcome to minority backed' });
};
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
// Generate token
var generateToken = function (userId, firstName, lastName, email, countryCode, role, profilePic) {
    return jwt.sign({ userId: userId, firstName: firstName, lastName: lastName, email: email, countryCode: countryCode, role: role, profilePic: profilePic }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};
//for many
module.exports = {
    register: register,
    logIn: logIn,
    welcome: welcome,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    authenticateGoogleUser: authenticateGoogleUser,
    getUploadedMedia: getUploadedMedia,
    deleteUploadedMedia: deleteUploadedMedia,
    registerPublisher: registerPublisher,
    updateAdvancerProfile: updateAdvancerProfile,
    updatePassword: updatePassword,
    uploadMedia: uploadMedia,
    updateUploadedMedia: updateUploadedMedia,
    deactivateAccount: deactivateAccount,
    sendDeleteAccountToken: sendDeleteAccountToken,
    deleteAccount: deleteAccount,
    sendContactUsEmail: sendContactUsEmail,
    subscribeToNewsLetterEmail: subscribeToNewsLetterEmail,
    GetGoogleTokens: GetGoogleTokens,
    GetGoogleCredentials: GetGoogleCredentials
};
