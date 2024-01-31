import { createLogger, transports, format } from "winston";

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
