import app from "@/app";
import config from "@/config";
import { ConnectDB } from "@/database";
import { Logger } from "@/utils/logger";
import { createChannel } from "@/utils/messageBroker";

const init = async () => {
  ConnectDB();

  await createChannel();

  app
    .listen(config.PORT, () => {
      Logger.info(`product service running on PORT: ${config.PORT}`);
    })
    .on("error", () => {
      Logger.error("Failed to start server");
      process.exit();
    });
};

init();
