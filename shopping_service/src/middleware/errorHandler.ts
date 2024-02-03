import { ErrorLogger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";

const errorHandler = async (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errorLogger = new ErrorLogger();

  process.on("uncaughtException", (reason) => {
    errorLogger.logError(reason);
    throw reason; // need to take care
  });

  process.on("uncaughtException", (error) => {
    errorLogger.logError(error);
    if (errorLogger.isTrustError(err)) {
      //process exist // need restart
    }
  });

  if (err) {
    await errorLogger.logError(err);
    if (errorLogger.isTrustError(err)) {
      if (err.errorStack) {
        const errorDescription = err.errorStack;
        return res.status(err.statusCode).json({ message: errorDescription });
      }
      return res.status(err.statusCode).json({ message: err.message });
    } else {
      //process exit // terriablly wrong with flow need restart
    }
    return res.status(err.statusCode).json({ message: err.message });
  }
  next();
};

export default errorHandler;
