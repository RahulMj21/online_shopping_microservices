import config from "@/config";
import { publishMessage } from "@/utils/messageBroker";

class QueueService {
  publishCustomerMessage(data: any) {
    publishMessage(config.CUSTOMER_BINDING_KEY, data);
  }
}

export default QueueService;
