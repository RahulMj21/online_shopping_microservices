import { createLogger, transports, format } from "winston";
import { AppError } from "@/utils/appError";

const { combine, timestamp, label, printf, colorize } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp}] ${label} ${level}: ${message}`;
});

export const Logger = createLogger({
  format: combine(
    label({ label: "🚀" }),
    colorize(),
    timestamp({ format: "DD-MM-YYYY HH:mm:ssA Z" }),
    myFormat,
  ),
  transports: [new transports.Console()],
});

const LogErrors = createLogger({
  format: combine(
    label({ label: "🚀" }),
    colorize(),
    timestamp({ format: "DD-MM-YYYY HH:mm:ssA Z" }),
    myFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app_error.log" }),
  ],
});

export class ErrorLogger {
  logError = async (err: any) => {
    console.log("==================== Start Error Logger ===============");
    LogErrors.log({
      private: true,
      level: "error",
      message: `${new Date()} - ${JSON.stringify(err)}`,
    });
    console.log("==================== End Error Logger ===============");

    return false;
  };

  isTrustError = (error: Error) => {
    if (error instanceof AppError) {
      return error.isOperational;
    } else {
      return false;
    }
  };
}
