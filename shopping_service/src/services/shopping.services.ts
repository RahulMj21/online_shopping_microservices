import { StatusCode } from "@/constants/app.constants";
import { ShoppingRepository } from "@/database";
import { IAddToCartInput, IEventPayload, IOrder, TEvent } from "@/types";
import { formateData } from "@/utils";
import { ApiError } from "@/utils/appError";
import { Logger } from "@/utils/logger";

class ShoppingService {
  repository: ShoppingRepository;

  constructor() {
    this.repository = new ShoppingRepository();
  }

  async getCart(customerId: string) {
    try {
      const cart = await this.repository.cart(customerId);
      return formateData(cart);
    } catch (error) {
      throw new ApiError(
        "Data Not Found",
        StatusCode.BAD_REQUEST,
        JSON.stringify(error),
      );
    }
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

  async getOrderDetails(orderId: string) {
    try {
      const order = await this.repository.orderDetails(orderId);
      return formateData(order);
    } catch (error) {
      throw new ApiError(
        "Data Not Found",
        StatusCode.BAD_REQUEST,
        JSON.stringify(error),
      );
    }
  }

  async manageCart(input: IAddToCartInput) {
    try {
      const cart = await this.repository.addCartItem(input);
      return formateData(cart);
    } catch (error) {
      throw new ApiError(
        "Data Not Found",
        StatusCode.BAD_REQUEST,
        JSON.stringify(error),
      );
    }
  }

  async subscribeEvents({
    data: { customerId, qty, product },
    event,
  }: IEventPayload) {
    switch (event) {
      case "ADD_TO_CART":
        if (customerId && product && qty) {
          this.manageCart({ customerId, product, qty, isRemove: false });
        }
        break;
      case "REMOVE_FROM_CART":
        if (customerId && product && qty) {
          this.manageCart({ customerId, product, qty, isRemove: true });
        }
        break;
      case "TEST":
        Logger.info("==========TEST_EVENT_RECEIVED========");
        break;
      default:
        break;
    }
  }

  getOrderPayload({
    customerId,
    order,
    event,
  }: {
    customerId: string;
    order: IOrder;
    event: TEvent;
  }) {
    const payload = {
      event,
      data: { customerId, order },
    };
    return payload;
  }
}

export default ShoppingService;
