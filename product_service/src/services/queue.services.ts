import config from "@/config";
import { publishMessage } from "@/utils/messageBroker";

class QueueService {
  publish: (key: string, data: any) => void;

  constructor() {
    this.publish = (key, data) => {
      publishMessage(key, data);
    };
  }

  publishCustomerMessage(data: any) {
    this.publish(config.CUSTOMER_BINDING_KEY, data);
  }

  publishShoppingMessage(data: any) {
    this.publish(config.SHOPPING_BINDING_KEY, data);
  }
}

export default QueueService;
