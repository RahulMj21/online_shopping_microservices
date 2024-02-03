import { StatusCode } from "@/constants/app.constants";
import ShoppingService from "@/services/shopping.services";
import { IRequest } from "@/types";
import BigPromise from "@/utils/bigPromise";
import { Logger } from "@/utils/logger";
import { NextFunction, Response } from "express";

const shoppingService = new ShoppingService();

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

        const { data } = await shoppingService.getCart(_id);
        return res.status(StatusCode.CREATED).json(data);
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  events = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (!req.body.payload) {
        return res.status(StatusCode.BAD_REQUEST).json({ status: "ERROR" });
      }

      const payload = req.body.payload;
      shoppingService.subscribeEvents(payload);

      Logger.info("======SHOPPING SERVICE RECEIVED EVENT=====");

      return res.status(StatusCode.OK).json(payload);
    },
  );
}

export default ShoppingController;
