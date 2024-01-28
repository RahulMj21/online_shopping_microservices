import config from "@/config";
import { Logger } from "@/utils/logger";
import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    await mongoose.connect(config.DB_URL as string);
    Logger.info("DB Connected...");
  } catch (error) {
    Logger.error(`Failed to Connect DB : ${error}`);
  }
};

export default ConnectDB;
