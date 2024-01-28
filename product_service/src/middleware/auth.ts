import { StatusCode } from "@/constants/app.constants";
import { IRequest } from "@/types";
import { validateSignature } from "@/utils";
import { NextFunction, Response } from "express";

const auth = async (req: IRequest, res: Response, next: NextFunction) => {
  const isAuthorized = validateSignature(req);
  if (isAuthorized) {
    next();
  } else {
    return res
      .status(StatusCode.UNAUTHORIZED)
      .json({ status: "ERROR", message: "unauthorized user" });
  }
};

export default auth;
