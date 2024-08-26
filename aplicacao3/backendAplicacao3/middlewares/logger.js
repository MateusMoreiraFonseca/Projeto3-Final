const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(), 
    new winston.transports.File({ filename: 'logs/combined.log' }) 
  ],
});

const logRequests = (req, res, next) => {
  logger.info({
    message: 'Request Received',
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body
  });
  next();
};

const logErrors = (err, req, res, next) => {
  logger.error({
    message: 'Error',
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack
  });
  next(err);
};

module.exports = { logger, logRequests, logErrors };
