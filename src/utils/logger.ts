import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

// logs dir
const logDir: string = join(__dirname, "../logs");

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const env = process.env.NODE_ENV || "development";

// Define log format
const logFormat = winston.format.printf(
  ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

const logger = winston.createLogger({
  // Remove colorize() from the global format so file logs stay plain.
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  transports: [
    new winstonDaily({
      level: env === "production" ? "error" : "debug",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/debug", // log file /logs/debug/*.log
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: logDir + "/error", // log file /logs/error/*.log
      filename: `%DATE%.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

// Console transport uses colors.
logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize(),
      logFormat
    ),
  })
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export { logger, stream };
