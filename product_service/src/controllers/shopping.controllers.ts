import { StatusCode } from "@/constants/app.constants";
import CustomerService from "@/services/customer.services";
import ShoppingService from "@/services/shopping.services";
import { IRequest } from "@/types";
import BigPromise from "@/utils/bigPromise";
import { NextFunction, Response } from "express";

const shoppingService = new ShoppingService();
const customerService = new CustomerService();

class ShoppingController {
  placeOrder = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { _id } = req.user;
        const { txnNumber } = req.body;

        const { data } = await shoppingService.placeOrder({
          customerId: _id,
          txnId: txnNumber,
        });
        return res.status(StatusCode.CREATED).json(data);
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  getShoppingOrders = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { _id } = req.user;

        const { data } = await shoppingService.getOrders(_id);
        return res.status(StatusCode.CREATED).json(data);
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  getShoppingCart = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { _id } = req.user;

        const { data } = await customerService.getProfile(_id);
        return res.status(StatusCode.CREATED).json(data);
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );
}

export default ShoppingController;
