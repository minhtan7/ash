var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config()
const cors = require("cors")

var indexRouter = require('./routes/index');

const mongoose = require('mongoose');
const utilsHelper = require('./helpers/utils.helper');

const MONGODB_URI = process.env.MONGODB_URI

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGODB_URI);
}


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/api', indexRouter);

app.use((req, res, next) => {
    const err = new Error("404 - Resource not found");
    next(err);
});

app.use((err, req, res, next) => {
    console.log("ERROR", err);
    const statusCode = err.message.split(" - ")[0];
    const message = err.message.split(" - ")[1];
    if (!isNaN(statusCode)) {
        utilsHelper.sendResponse(res, statusCode, false, null, { message }, null);
    } else {
        utilsHelper.sendResponse(
            res,
            500,
            false,
            null,
            { message: err.message },
            "Internal Server Error"
        );
    }
});

module.exports = app;
