import config from "@/config";
import amqp from "amqplib";

// Create Channel
export const createChannel = async () => {
  try {
    const conn = await amqp.connect(config.MESSAGE_BROKER_URL);
    const channel = await conn.createChannel();
    await channel.assertExchange(config.EXCHANGE_NAME, "direct", {
      durable: false,
    });

    config.MQ_CHANNEL = channel;
    return channel;
  } catch (error) {
    throw error;
  }
};

export const publishMessage = (bindingKey: string, data: any) => {
  try {
    config?.MQ_CHANNEL?.publish(
      config?.EXCHANGE_NAME,
      bindingKey,
      Buffer.from(data),
    );
  } catch (error) {
    throw error;
  }
};

export const subscribeMessage = async (bindingKey: string) => {
  try {
    const channel = config.MQ_CHANNEL;
    if (!channel) return;

    const appQueue = await channel.assertQueue(config.QUEUE_NAME);
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
