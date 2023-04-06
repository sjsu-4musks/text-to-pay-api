const winston = require("winston");

const { LOG_LEVEL } = require("./config");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const format = winston.format.combine(
  // winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(
    info => `${info.timestamp} ${info.level} ${info.message}`
  ),
  winston.format.simple()
);

const transports = [new winston.transports.Console()];

const logger = winston.createLogger({
  level: LOG_LEVEL || "debug",
  levels,
  format,
  transports
});

module.exports = logger;
