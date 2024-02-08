import { StatusCode } from "@/constants/app.constants";
import QueueService from "@/services/queue.services";
import ShoppingService from "@/services/shopping.services";
import { IRequest } from "@/types";
import BigPromise from "@/utils/bigPromise";
import { NextFunction, Response } from "express";

class ShoppingController {
  service: ShoppingService;
  queueService: QueueService;

  constructor() {
    this.service = new ShoppingService();
    this.queueService = new QueueService(this.service);
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

        this.queueService.publishCustomerMessage(payload);

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
}

export default ShoppingController;
