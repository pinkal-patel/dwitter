
//External Imports
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const uuid = require('uuid');

//Internal Imports
const UserModel = require('../users/model');
const config = require('../config')
const { checkRateLimit } = require('../utils/rateLimit')
const RefreshToken = require('./refreshTokenModel');
const logger = require("../config/logger")("authentication-auth");

const UserMethod = new UserModel()
const { TokenExpiredError } = jwt;

module.exports = (app) => {

    //To register new user
    app.post('/user/register', async (req, res) => {
        try {
            var newUser = req.body;

            // get the password hash store hash instead of of password in the db
            newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
            newUser.role = "user"
            newUser.userId = uuid.v4()

            // check if user already exists with the same email
            let existingUser = await UserModel.findOne({ "email": newUser.email })
            if (!existingUser) {
                //db call to create new user
                let result = await UserModel.create(newUser);
                logger.error(`User successfully regisstered with id : ${newUser.userId}`)
                result.hash_password = undefined;
                return res.json(result);
            } else {
                logger.error(`User already exists`)
                //if existing user then fail
                return res.status(500).send({
                    message: "user already exists"
                });
            }
        } catch (error) {
            logger.error(`Error in creating the user : ${error}`)
            return res.status(500).send({
                message: error.message
            });
        }
    });

    // login 
    app.post('/user/sign_in', checkRateLimit, async (req, res, next) => {
        try {
            // get user details from db
            let user = await UserModel.findOne({
                email: req.body.email
            }).lean()

            // compare the password
            if (!user || !UserMethod.comparePassword(req.body.password, user)) {
                logger.error(`Authentication failed. Invalid user or password.`)
                return res.status(401).json({ message: 'Authentication failed. Invalid user or password.' });
            }
            // generate access token and refresh token
            const tokens = {
                token: jwt.sign({ email: user.email, userName: user.userName, userId: user.userId, role: user.role }, config.jwt_token, {
                    expiresIn: config.jwt_token_exp,
                }),
                refreshToken: jwt.sign({ email: user.email, userName: user.userName, userId: user.userId, role: user.role }, config.jwt_refresh_token, {
                    expiresIn: config.jwt_refresh_token_exp,
                })
            }
            // create refresh token in db
            await RefreshToken.create({ userId: user.userId, token: tokens.refreshToken });
            logger.info(`Token created in db`)
            return res.json(tokens);
        } catch (error) {
            logger.error(`Error in login: ${error}`)
            return res.status(500).send({
                message: error.message
            });
        }
    })


    //logout
    app.delete('/user/logout', async (req, res) => {
        try {
            const refreshToken = req.body.token;
            //db call to remove refresh token from the database
            await RefreshToken.deleteOne({ token: refreshToken });
            req.user = undefined;
            logger.info(`Logged out successfully...`)
            return res.json({ "message": "Logged out successfully..." })
        } catch (error) {
            logger.error(`Error in logout: ${error}`)
            return res.status(500).send({
                message: error.message
            });
        }
    });

    // get new token from refresh token
    app.post('/token', async (req, res) => {
        try {
            const refreshToken = req.body.token;
            if (!refreshToken) return res.sendStatus(401);

            // get refresh token from db , if not found then fail
            const existingRefreshToken = await RefreshToken.findOne({ token: refreshToken }).lean();
            if (!existingRefreshToken) return res.sendStatus(403);

            // verify refresh token
            jwt.verify(refreshToken, config.jwt_refresh_token, async (err, user) => {
                if (err) {
                    if (err instanceof TokenExpiredError) {
                        logger.error(`Unauthorized! Access Token was expired!`)
                        return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
                    }
                    logger.error(`Unauthorized user!`)
                    return res.sendStatus(401).send({ message: "Unauthorized user!" });
                }
                // if verified then create new access token
                const token = jwt.sign({ email: user.email, userName: user.userName, userId: user.userId, role: user.role }, config.jwt_token, {
                    expiresIn: config.jwt_token_exp
                })
                res.json({ token });
            });
        } catch (error) {
            logger.error(`Error in get tokens: ${error}`)
            return res.status(500).send({
                message: error.message
            });
        }
    });
}