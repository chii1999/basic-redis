const Redis = require("ioredis")

const options = {}   

const redisCache = new Redis(options);

module.exports = { redisCache };