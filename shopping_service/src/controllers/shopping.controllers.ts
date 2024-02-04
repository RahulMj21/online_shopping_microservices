import { StatusCode } from "@/constants/app.constants";
import ShoppingService from "@/services/shopping.services";
import { IRequest } from "@/types";
import { publishCustomerEvent } from "@/utils";
import BigPromise from "@/utils/bigPromise";
import { Logger } from "@/utils/logger";
import { NextFunction, Response } from "express";

class ShoppingController {
  service: ShoppingService;

  constructor() {
    this.service = new ShoppingService();
  }

  placeOrder = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { _id } = req.user;
        const { txnId } = req.body;

        const { data } = await this.service.placeOrder({
          customerId: _id,
          txnId: txnId,
        });

        const payload = this.service.getOrderPayload({
          customerId: _id,
          event: "CREATE_ORDER",
          order: data,
        });
        // console.log("----------------------------------------");
        // console.log(JSON.stringify({ payload }));
        // console.log("----------------------------------------");

        publishCustomerEvent(payload);

        return res.status(StatusCode.CREATED).json(data);
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  getShoppingOrders = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { _id } = req.user;

        const { data } = await this.service.getOrders(_id);
        return res.status(StatusCode.CREATED).json(data);
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  getShoppingCart = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { _id } = req.user;

        const { data } = await this.service.getCart(_id);
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
      this.service.subscribeEvents(payload);

      Logger.info("======SHOPPING SERVICE RECEIVED EVENT=====");

      return res.status(StatusCode.OK).json(payload);
    },
  );
}

export default ShoppingController;
