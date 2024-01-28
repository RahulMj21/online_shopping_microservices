import { StatusCode } from "@/constants/app.constants";
import { ApiError } from "@/utils/appError";
import { CustomerModel, OrderModel } from "@/database/models";
import { ICreateOrderInput, IProduct } from "@/types";
import { v4 as uuid } from "uuid";

class ShoppingRepository {
  async orders(customerId: string) {
    try {
      const orders = await OrderModel.find({ customerId }).populate(
        "items.product",
      );
      return orders;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to find orders",
      );
    }
  }

  async createNewOrder({ customerId, txnId }: ICreateOrderInput) {
    try {
      const customer =
        await CustomerModel.findById(customerId).populate("cart.product");

      if (customer) {
        let amount = 0;
        let cartItems = customer.cart;

        if (cartItems.length > 0) {
          cartItems.forEach((item) => {
            const product = item.product as IProduct;
            amount += product.price * product.unit;
          });
        }

        const orderId = uuid();

        const order = new OrderModel({
          orderId,
          customerId,
          amount,
          txnId,
          status: "received",
          items: cartItems,
        });

        customer.cart = [];

        order.populate("items.product");
        const orderResult = await order.save();

        customer.orders.push(orderResult);
        await customer.save();

        return orderResult;
      }
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to place order",
      );
    }
  }
}

export default ShoppingRepository;
