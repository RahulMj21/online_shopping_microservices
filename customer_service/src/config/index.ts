import dotenv from "dotenv";
import { Channel } from "amqplib";

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}

interface IConfig {
  PORT: string;
  DB_URL: string;
  TOKEN_SECRET: string;
  MESSAGE_BROKER_URL: string;
  EXCHANGE_NAME: string;
  CUSTOMER_QUEUE: string;
  CUSTOMER_BINDING_KEY: string;
  MQ_CHANNEL: Channel | null;
}

const config: IConfig = {
  PORT: process.env.PORT || "8000",
  DB_URL: process.env.DB_URL as string,
  TOKEN_SECRET: process.env.TOKEN_SECRET as string,
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL as string,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME as string,
  CUSTOMER_QUEUE: process.env.CUSTOMER_QUEUE as string,
  CUSTOMER_BINDING_KEY: process.env.CUSTOMER_BINDING_KEY as string,
  MQ_CHANNEL: null,
};

export default config;
