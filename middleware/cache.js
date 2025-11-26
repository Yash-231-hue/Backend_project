const redisClient = require('../config/redisClient');

const cacheMiddleware = (keyPrefix, ttlSeconds = 60) => {
  return async (req, res, next) => {
    const key = keyPrefix + JSON.stringify(req.params) + JSON.stringify(req.query);
    try {
      const cachedData = await redisClient.get(key);
      if (cachedData) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(JSON.parse(cachedData));
      }
      // Override res.json to cache response data
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        redisClient.setEx(key, ttlSeconds, JSON.stringify(body));
        res.setHeader('X-Cache', 'MISS');
        return originalJson(body);
      };
      next();
    } catch (err) {
      console.error('Redis cache error:', err);
      next();
    }
  };
};

module.exports = cacheMiddleware;
