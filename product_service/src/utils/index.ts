import config from "@/config";
import { IGenerateSignatureInput, IRequest, IUser } from "@/types";
import { Logger } from "@/utils/logger";
import argon from "argon2";
import JWT from "jsonwebtoken";

export const generatePassword = async (password: string) => {
  return await argon.hash(password);
};

export const validatePassword = async (
  passwordHash: string,
  password: string,
) => {
  return await argon.verify(passwordHash, password);
};

export const generateSignature = (payload: IGenerateSignatureInput) => {
  return JWT.sign(payload, config.TOKEN_SECRET, { expiresIn: "30d" });
};

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
