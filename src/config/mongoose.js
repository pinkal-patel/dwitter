
const mongoose = require("mongoose");

//Internal Imports
const config = require("./index");
const logger = require("./logger")("mongoose");

exports.connect = () => {

    // Connecting to the database
    mongoose.connect(config.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        logger.info(`Successfully connected to database`);
    }).catch((error) => {
        logger.error(`database connection failed. exiting now...`);
        logger.error(error)
        process.exit(1);
    });
};
