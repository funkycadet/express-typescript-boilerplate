import winston from "winston";

// Define log levels (optional customization)
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Create the logger
const logger = winston.createLogger({
  levels, // Use custom levels if desired, or stick with defaults
  level: process.env.NODE_ENV === "development" ? "debug" : "info", // More verbose in dev
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamps
    winston.format.colorize(), // Colorize for local console (ignored by Render)
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Logs to stdout (Render captures this)
    // Optional: Add file logging for local debugging
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

// Morgan integration (optional, to pipe HTTP logs)
const morganStream = {
  write: (message: string) => logger.http(message.trim()), // Use 'http' level for requests
};

export { logger, morganStream };
