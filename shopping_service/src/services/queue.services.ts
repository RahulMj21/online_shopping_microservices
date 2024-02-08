import config from "@/config";
import amqp from "amqplib";
import { Logger } from "@/utils/logger";
import ShoppingService from "@/services/shopping.services";

class QueueService {
  channel: amqp.Channel | null;
  shoppingService: ShoppingService;

  constructor(customerService: ShoppingService) {
    this.channel = null;
    this.shoppingService = customerService;
    this.initMessageBroker();
  }

  // Create Channel
  createChannel = async () => {
    try {
      const conn = await amqp.connect(config.MESSAGE_BROKER_URL);
      const channel = await conn.createChannel();
      await channel.assertExchange(config.EXCHANGE_NAME, "direct", {
        durable: true,
      });

      this.channel = channel;

      Logger.info("Message Broker Connected...");

      return channel;
    } catch (error) {
      throw error;
    }
  };

  publishMessage = (bindingKey: string, data: any) => {
    try {
      this.channel?.publish(
        config?.EXCHANGE_NAME,
        bindingKey,
        Buffer.from(JSON.stringify(data)),
      );
    } catch (error) {
      throw error;
    }
  };

  publishCustomerMessage(data: any) {
    this.publishMessage(config.CUSTOMER_BINDING_KEY, data);
  }

  subscribeMessage = async (
    channel: amqp.Channel,
    bindingKey: string,
    queueName: string,
  ) => {
    try {
      const appQueue = await channel.assertQueue(queueName);
      await channel.bindQueue(appQueue.queue, config.EXCHANGE_NAME, bindingKey);

      channel.consume(appQueue.queue, (data) => {
        if (data) {
          console.log(
            "-------------------Received in Queue-------------------",
          );

          const payload = JSON.parse(data.content.toString());
          this.shoppingService.subscribeEvents(payload);
          channel.ack(data);
        }
      });
    } catch (error) {
      throw error;
    }
  };

  async initMessageBroker() {
    const ch = await this.createChannel();
    this.channel = ch;
    this.subscribeMessage(
      ch,
      config.SHOPPING_BINDING_KEY,
      config.SHOPPING_QUEUE,
    );
  }
}

export default QueueService;
