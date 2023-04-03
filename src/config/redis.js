//External Import
const Redis = require('ioredis');

// get redis instance
const redis = new Redis();

module.exports = redis;