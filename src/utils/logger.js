import winston from "winston";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    level: "debug",
    format: consoleFormat,
  }),

  new winston.transports.File({
    filename: join(__dirname, "../../logs/error.log"),
    level: "error",
    format: fileFormat,
  }),

  new winston.transports.File({
    filename: join(__dirname, "../../logs/combined.log"),
    format: fileFormat,
  }),
];

const Logger = winston.createLogger({
  level: "debug",
  levels,
  format: fileFormat,
  transports,
  exitOnError: false,
});

export default Logger;
