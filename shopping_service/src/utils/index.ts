import config from "@/config";
import { IGenerateSignatureInput, IRequest, IUser } from "@/types";
import { Logger } from "@/utils/logger";
import JWT from "jsonwebtoken";
import axios from "axios";

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

export const publishCustomerEvent = async (payload: any) => {
  try {
    // await axios.post(`${config.API_GATEWAY_URL}/customer/app-events`, {
    //   payload,
    // });
    await axios.post(`http://localhost:8001/customer/app-events`, {
      payload,
    });
    return true;
  } catch (error) {
    return false;
  }
};
