import app from "@/app";
import config from "@/config";
import { ConnectDB } from "@/database";
import { Logger } from "@/utils/logger";

const init = async () => {
  ConnectDB();

  app
    .listen(config.PORT, () => {
      Logger.info(`server is running on PORT: ${config.PORT}`);
    })
    .on("error", () => {
      Logger.error("Failed to start server");
      process.exit();
    });
};

init();
