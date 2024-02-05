import config from "@/config";
import amqplib from "amqplib";
import { Logger } from "@/utils/logger";

// Message Broker

// Create Channel
export const createChannel = async () => {
  try {
    const conn = await amqplib.connect(config.MESSAGE_BROKER_URL);
    const channel = await conn.createChannel();
    await channel.assertExchange(config.EXCHANGE_NAME, "direct", {
      durable: false,
    });

    return channel;
  } catch (error) {
    throw error;
  }
};

// Publish Message
export const publishMessage = (bindingKey: string, message: any) => {
  try {
    config.MQ_CHANNEL?.publish(
      config.EXCHANGE_NAME,
      bindingKey,
      Buffer.from(message),
    );
  } catch (error) {
    throw error;
  }
};

// Publish Message
export const subscribeMessage = async (bindingKey: string) => {
  try {
    const channel = config.MQ_CHANNEL;
    if (!channel) return;

    const appQueue = await channel.assertQueue(config.QUEUE_NAME);
    await channel.bindQueue(appQueue.queue, config.EXCHANGE_NAME, bindingKey);

    channel.consume(appQueue.queue, (data) => {
      if (data) {
        console.log("-----------------Received in Queue-------------------");
        Logger.info(data.content.toString());
        channel.ack;
      }
    });
  } catch (error) {
    throw error;
  }
};
