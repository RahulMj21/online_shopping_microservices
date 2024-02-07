import config from "@/config";
import amqplib from "amqplib";
import { Logger } from "@/utils/logger";

// Create Channel
export const createChannel = async () => {
  try {
    const conn = await amqplib.connect(config.MESSAGE_BROKER_URL);
    const channel = await conn.createChannel();
    await channel.assertExchange(config.EXCHANGE_NAME, "direct", {
      durable: true,
    });
    config.MQ_CHANNEL = channel;

    Logger.info("Message Broker Connected...");

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

// Subscribe Message
export const subscribeMessage = async (
  bindingKey: string,
  queueName: string,
) => {
  try {
    const channel = config.MQ_CHANNEL;
    if (!channel) return;

    const appQueue = await channel.assertQueue(queueName);
    await channel.bindQueue(appQueue.queue, config.EXCHANGE_NAME, bindingKey);

    channel.consume(appQueue.queue, (data) => {
      if (data) {
        console.log("-------------------Received in Queue-------------------");
        console.log(data.content.toString());
        channel.ack(data);
      }
    });
  } catch (error) {
    throw error;
  }
};

export const initMessageBroker = async () => {
  try {
    const channel = await createChannel();
    if (channel) {
      await subscribeMessage(
        config.SHOPPING_BINDING_KEY,
        config.SHOPPING_QUEUE,
      );
    }
  } catch (error) {
    throw error;
  }
};
