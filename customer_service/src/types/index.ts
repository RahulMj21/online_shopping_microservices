import { Request } from "express";

// Types
export type TEvent =
  | "ADD_TO_WISHLIST"
  | "REMOVE_FROM_WISHLIST"
  | "ADD_TO_CART"
  | "REMOVE_FROM_CART"
  | "CREATE_ORDER";

// Interfaces
export interface IAddress {
  _id: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  phone: string;
  address: (IAddress | string)[];
  cart: ICartItem[];
  wishlist: (IProduct | string)[];
  orders: (IOrder | string)[];
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  banner: string;
  type: string;
  unit: number;
  price: number;
  available: boolean;
  suplier: string;
}

export interface IOrderItem {
  product: IProduct | string;
  unit: number;
}

export interface IOrder {
  orderId: string;
  customerId: string;
  amount: number;
  status: string;
  txnId: string;
  items: IOrderItem[];
}

export interface ICartItem {
  product: IProduct | string;
  unit: number;
}

export interface ICreateProductInput {
  name: string;
  type: string;
  unit: number;
  price: number;
  banner: string;
  suplier: string;
  available: boolean;
  description: string;
}

export interface ICreateOrderInput {
  customerId: string;
  txnId: string;
}

export interface ICreateCustomerInput {
  email: string;
  password: string;
  phone: string;
}

export interface ICreateAddressInput {
  customerId: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
}
export interface IAddToCartInput {
  customerId: string;
  product: IProduct;
  qty: number;
  isRemove: boolean;
}
export interface IRequest extends Request {
  user?: IUser;
}

export interface ISignInInput {
  email: string;
  password: string;
}

export interface ISignUpInput {
  email: string;
  password: string;
  phone: string;
}

export interface IGenerateSignatureInput {
  email: string;
  phone: string;
  _id: string;
}

export interface IEventData {
  customerId: string;
  product: IProduct;
  order: IOrder;
  qty: number;
}

export interface IEventPayload {
  event: TEvent;
  data: IEventData;
}
