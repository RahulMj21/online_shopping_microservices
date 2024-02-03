import { StatusCode } from "@/constants/app.constants";
import { ApiError } from "@/utils/appError";
import { CartModel, OrderModel } from "@/database/models";
import { IAddToCartInput, ICreateOrderInput } from "@/types";
import { v4 as uuid } from "uuid";

class ShoppingRepository {
  async orders(customerId: string) {
    try {
      const orders = await OrderModel.find({ customerId });
      return orders;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to find orders",
      );
    }
  }

  async orderDetails(orderId: string) {
    try {
      const order = await OrderModel.findOne({ orderId });
      return order;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to find orders",
      );
    }
  }

  async cart(customerId: string) {
    try {
      const cartItem = await CartModel.findOne({ customerId });
      return cartItem;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to find cart",
      );
    }
  }

  async addCartItem({ customerId, qty, product, isRemove }: IAddToCartInput) {
    try {
      const cart = await CartModel.findOne({ customerId });

      if (cart) {
        cart;
        let isExist = false;
        let cartItems = cart.items;

        cart.items.forEach(async (item, idx) => {
          if (String(item.product._id) === String(product._id)) {
            isExist = true;
            if (isRemove) {
              if (cart.items.length === 1) {
                await cart.deleteOne();
                return;
              }
              cartItems.splice(idx, 1);
            } else {
              cartItems[idx].qty = qty;
            }
          }
        });

        if (!isExist && !isRemove) {
          cartItems.push({ product, unit: qty });
        }

        cart.items = cartItems;
        const cartResult = await cart.save();
        return cartResult;
      } else {
        // create cart item
        const cartResult = await CartModel.create({
          customerId,
          items: [{ product, unit: qty }],
        });
        return cartResult;
      }
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to add to cart",
      );
    }
  }

  async createNewOrder({ customerId, txnId }: ICreateOrderInput) {
    try {
      const cart = await CartModel.findOne({ customerId });

      if (cart) {
        let amount = 0;
        let cartItems = cart.items;

        if (cartItems.length > 0) {
          amount = cartItems.reduce(
            (accum, item) => (accum += item.product.price * item.unit),
            0,
          );
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

        const orderResult = await order.save();
        await cart.deleteOne();

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
