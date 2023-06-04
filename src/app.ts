import express from "express";
require('dotenv').config();
const mongoose = require('mongoose');
const bp = require('body-parser');
const app = express();
const Routes = require('./routes/routerLinks');
var cors = require('cors');
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cors())
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");
import * as swaggerDocument from './swaggerDocument.json';

// swagger config
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument,{ explorer: true })
  );

function loggerMiddleware(request: express.Request, response: express.Response, next: () => void) {
    next();
  }
app.use(loggerMiddleware);

// routes 
app.use('/',Routes);

// connect to database
mongoose.connect(process.env.MONGO_URI)
        .then(()=>{
            // listen for requests
            app.listen(process.env.PORT,()=>{
                console.log('connected and listening on port',process.env.PORT)
            })
        })
        .catch((error: any)=>{
            console.log(error);
        })