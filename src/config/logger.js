///External Imports
const bunyan = require('bunyan')

//Internal Imports
const config = require('./index')

//to initialize the logger
const InitLogger = (fileName) => {
    const logger = bunyan.createLogger({
        name: fileName,
        env: config.node_env,
        serializers: bunyan.stdSerializers,
        src: true,
        level: 5,
    })

    return logger
}

module.exports = InitLogger