import { StatusCode } from "@/constants/app.constants";
import { CustomerRepository } from "@/database";
import {
  IAddToCartInput,
  ICreateAddressInput,
  IEventPayload,
  IOrder,
  IProduct,
  ISignInInput,
  ISignUpInput,
} from "@/types";
import {
  formateData,
  generatePassword,
  generateSignature,
  validatePassword,
} from "@/utils";
import { ApiError } from "@/utils/appError";

class CustomerService {
  repository: CustomerRepository;

  constructor() {
    this.repository = new CustomerRepository();
  }

  async signIn({ email, password }: ISignInInput) {
    try {
      let existingCustomer = await this.repository.findCustomer(email);
      if (existingCustomer) {
        const validPassword = await validatePassword(
          existingCustomer.password,
          password,
        );

        if (validPassword) {
          const { email, phone, _id } = existingCustomer;
          const payload = {
            email,
            phone,
            _id,
          };
          const token = generateSignature(payload);
          return formateData({ id: existingCustomer._id, token });
        }
        return formateData(null);
      }
    } catch (error) {
      throw new ApiError(
        "failed to sign in",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async signUp({ email, phone, password }: ISignUpInput) {
    try {
      const hashedPassword = await generatePassword(password);
      const customer = await this.repository.createCustomer({
        email,
        phone,
        password: hashedPassword,
      });

      const payload = {
        email,
        phone,
        _id: customer?._id,
      };
      const token = generateSignature(payload);

      return formateData({ id: customer._id, token });
    } catch (error) {
      throw new ApiError(
        "failed to sign up",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async addNewAddress(input: ICreateAddressInput) {
    try {
      const addressResult = await this.repository.createAddress(input);

      return formateData(addressResult);
    } catch (error) {
      throw new ApiError(
        "failed to add new address",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async getProfile(customerId: string) {
    try {
      const customer = await this.repository.findCustomerById(customerId);

      return formateData(customer);
    } catch (error) {
      throw new ApiError(
        "failed to get customer profile",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async getWishlist(customerId: string) {
    try {
      const wishlist = await this.repository.wishlist(customerId);

      return formateData(wishlist);
    } catch (error) {
      throw new ApiError(
        "failed to get customer wishlist",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async addToWishlist(customerId: string, product: IProduct) {
    try {
      const wishlist = await this.repository.addWishlistItem(
        customerId,
        product,
      );

      return formateData(wishlist);
    } catch (error) {
      throw new ApiError(
        "failed to add item in customer wishlist",
        StatusCode.SERVER_ERROR,
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
        "failed to update cart",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async manageOrder(customerId: string, order: IOrder) {
    try {
      const orderResult = await this.repository.addOrderToProfile(
        customerId,
        order,
      );

      return formateData(orderResult);
    } catch (error) {
      throw new ApiError(
        "failed to update order",
        StatusCode.SERVER_ERROR,
        JSON.stringify(error),
      );
    }
  }

  async subscribeEvents({
    data: { customerId, order, qty, product },
    event,
  }: IEventPayload) {
    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.addToWishlist(customerId, product);
        break;
      case "ADD_TO_CART":
        this.manageCart({ customerId, product, qty, isRemove: false });
        break;
      case "REMOVE_FROM_CART":
        this.manageCart({ customerId, product, qty, isRemove: true });
        break;
      case "CREATE_ORDER":
        this.manageOrder(customerId, order);
        break;
      default:
        break;
    }
  }
}

export default CustomerService;
