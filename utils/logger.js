// logger.js
import winston from "winston";

const logger = winston.createLogger({
  level: "info", // Minimum log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: "logs/application.log" })
  ],
});

export default logger;
