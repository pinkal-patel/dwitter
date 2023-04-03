//Internal imports
const redis = require('../config/redis')
const logger = require("../config/logger")("rateLimit");


// To check rate limit
const checkRateLimit = async (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // increase the request count in redis
    const requests = await redis.incr(ip);

    logger.info(`Number of requests made so far ${requests} from ${ip}`);

    if (requests === 1) {
        await redis.expire(ip, 60 * 15);
    }
    // if more than 5 request made then fail that request
    if (requests > 5) {
        res.status(503)
            .json({
                response: 'Error',
                requestCount: requests,
                msg: 'No of request exceeded'
            });
    } else {
        next();
    }
}

module.exports = {
    checkRateLimit
}