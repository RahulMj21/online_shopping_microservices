import { NextFunction, Request, Response } from "express";

const BigPromise =
  (handler: Function) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(handler(req, res, next)).catch(next);
  };

export default BigPromise;
