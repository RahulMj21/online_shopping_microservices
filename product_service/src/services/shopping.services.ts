import { StatusCode } from "@/constants/app.constants";
import { ShoppingRepository } from "@/database";
import { formateData } from "@/utils";
import { ApiError } from "@/utils/appError";

class ShoppingService {
  repository: ShoppingRepository;

  constructor() {
    this.repository = new ShoppingRepository();
  }

  async placeOrder({
    customerId,
    txnId,
  }: {
    customerId: string;
    txnId: string;
  }) {
    try {
      const orderResult = await this.repository.createNewOrder({
        customerId,
        txnId,
      });
      return formateData(orderResult);
    } catch (error) {
      throw new ApiError(
        "Data Not Found",
        StatusCode.BAD_REQUEST,
        JSON.stringify(error),
      );
    }
  }

  async getOrders(customerId: string) {
    try {
      const orders = await this.repository.orders(customerId);
      return formateData(orders);
    } catch (error) {
      throw new ApiError(
        "Data Not Found",
        StatusCode.BAD_REQUEST,
        JSON.stringify(error),
      );
    }
  }
}

export default ShoppingService;
