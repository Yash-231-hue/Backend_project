const logger = require('../utils/logger');

// Middleware to log all incoming requests
const requestLogger = (req, res, next) => {
  // Log the incoming request
  logger.info(`${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });

  // Capture response time
  const start = Date.now();

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    
    // Log response details
    logger.info(`Response: ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      success: data?.success
    });

    return originalJson.call(this, data);
  };

  next();
};

module.exports = requestLogger;