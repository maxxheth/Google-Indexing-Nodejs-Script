// @ts-ignore
import winston from "winston";
import { FileTransportOptions } from "winston/lib/winston/transports";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    } as FileTransportOptions),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// logger.info("greeting", (msg) => z);
