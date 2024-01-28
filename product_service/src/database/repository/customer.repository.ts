import { StatusCode } from "@/constants/app.constants";
import {
  IAddToCartInput,
  ICreateAddressInput,
  ICreateCustomerInput,
  IOrder,
  IProduct,
} from "@/types";
import { ApiError } from "@/utils/appError";
import { AddressModel, CustomerModel } from "@/database/models";

class CustomerRepository {
  async createCustomer({ email, password, phone }: ICreateCustomerInput) {
    try {
      const customer = await CustomerModel.create({
        email,
        password,
        phone,
        address: [],
      });
      return customer;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to add customer",
      );
    }
  }

  async createAddress({
    customerId,
    city,
    postalCode,
    street,
    country,
  }: ICreateAddressInput) {
    try {
      const customer = await CustomerModel.findById(customerId);
      if (customer) {
        const address = await AddressModel.create({
          city,
          postalCode,
          street,
          country,
        });
        customer.address.push(address);
        await customer.save();
      }
      return customer;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to add address",
      );
    }
  }

  async findCustomer(email: string) {
    try {
      const customer = await CustomerModel.findOne({ email });
      return customer;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to find customer",
      );
    }
  }

  async findCustomerById(id: string) {
    try {
      const customer = await CustomerModel.findById(id)
        .populate("address")
        .populate("wishlist")
        .populate("orders")
        .populate("cart.product");
      return customer;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to find customer",
      );
    }
  }

  async wishlist(customerId: string) {
    try {
      const customer =
        await CustomerModel.findById(customerId).populate("wishlist");

      return customer?.wishlist;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to find customer",
      );
    }
  }

  async addWishlistItem(customerId: string, product: IProduct) {
    try {
      const customer =
        await CustomerModel.findById(customerId).populate("wishlist");

      if (customer) {
        let wishlist = customer.wishlist as IProduct[];

        if (wishlist.length > 0) {
          let isExist = false;
          wishlist.map((item, idx) => {
            if (String(item._id) === String(product._id)) {
              wishlist.splice(idx, 1);
              isExist = true;
            }
          });

          if (!isExist) {
            wishlist.push(product);
          }
        } else {
          wishlist.push(product);
        }

        customer.wishlist = wishlist;
      }
      const customerResult = await customer?.save();

      return customerResult?.wishlist;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to add to wishlist",
      );
    }
  }

  async addCartItem({ customerId, qty, product, isRemove }: IAddToCartInput) {
    try {
      const customer =
        await CustomerModel.findById(customerId).populate("customer.product");

      if (customer) {
        let cartItem = {
          product,
          unit: qty,
        };

        let cartItems = customer.cart;

        if (cartItems.length > 0) {
          let isExist = false;

          cartItems.map((item, idx) => {
            const productItem = item.product as IProduct;

            if (String(productItem._id) === String(product._id)) {
              isExist = true;
              if (isRemove) {
                cartItems.splice(idx, 1);
              } else {
                item.unit = qty;
              }
            }
          });

          if (!isExist) {
            cartItems.push(cartItem);
          }
        } else {
          cartItems.push(cartItem);
        }
        customer.cart = cartItems;
      }

      const customerResult = await customer?.save();
      return customerResult?.cart;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to add to cart",
      );
    }
  }

  async addOrderToProfile(customerId: string, order: IOrder) {
    try {
      const customer =
        await CustomerModel.findById(customerId).populate("orders");

      if (customer) {
        if (!customer.orders) {
          customer.orders = [];
        }
        customer.orders.push(order);

        customer.cart = [];
      }
      const customerResult = await customer?.save();
      return customerResult;
    } catch (error) {
      throw new ApiError(
        "API ERROR",
        StatusCode.SERVER_ERROR,
        "unable to add order to profile",
      );
    }
  }
}

export default CustomerRepository;
