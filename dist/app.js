"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
require('dotenv').config();
var mongoose = require('mongoose');
var bp = require('body-parser');
var app = (0, express_1.default)();
var Routes = require('./routes/routerLinks');
var cors = require('cors');
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(cors());
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var swaggerDocument = __importStar(require("./swaggerDocument.json"));
// swagger config
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));
function loggerMiddleware(request, response, next) {
    next();
}
app.use(loggerMiddleware);
// routes 
app.use('/', Routes);
// connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(function () {
    // listen for requests
    app.listen(process.env.PORT, function () {
        console.log('connected and listening on port', process.env.PORT);
    });
})
    .catch(function (error) {
    console.log(error);
});
