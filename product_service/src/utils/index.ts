import config from "@/config";
import { IRequest, IUser } from "@/types";
import { Logger } from "@/utils/logger";
import JWT from "jsonwebtoken";

export const validateSignature = (req: IRequest) => {
  try {
    const signature = req.get("Authorization");
    if (!signature) return false;

    const payload = JWT.verify(signature.split(" ")[1], config.TOKEN_SECRET);
    req.user = payload as IUser;
    return true;
  } catch (error) {
    Logger.error("Error :", JSON.stringify(error));
    return false;
  }
};

export const formateData = (data: any) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};
