
//external Imports
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const jsonwebtoken = require("jsonwebtoken");

//Internal imports
const config = require("../config")
const routes = require('../routes/index');
const { authorizedUrls } = require('./constants');

const app = express();
const { TokenExpiredError } = jsonwebtoken;

app.set("env", config.node_env);

// Enable request body parsing
app.use(bodyParser.urlencoded({ extended: true }));
// Enable request body parsing in JSON format
app.use(bodyParser.json({}));


// require('../authentication/auth')(app)

// middleware to verify token
app.use(function (req, res, next) {
    if (authorizedUrls.includes(req.originalUrl)) {
        next();
    } else if (req.headers && req.headers.authorization && (req.headers.authorization.split(' ')[0] === 'JWT' || req.headers.authorization.split(' ')[0] === 'Bearer')) {
        jsonwebtoken.verify(req.headers.authorization.split(' ')[1], config.jwt_token, (err, decode) => {
            if (err) {
                if (err instanceof TokenExpiredError) {
                    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
                }
                return res.status(401).send({ message: "Unauthorized user!" });
            }
            req.user = decode;
            next();
        });
    } else {
        return res.status(403).send({ message: "No token provided!" });
    }
});

require('./mongoose').connect();

routes(app)

module.exports = app;