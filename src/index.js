//External imports
require('dotenv').config();
const http = require("http");
const logger = require("./config/logger")("index");

// internal imports
const app = require('./config/express')

// To start the server
const server = http.createServer(app).listen(process.env.PORT);
logger.info(`Application started on port :${process.env.PORT}`);
