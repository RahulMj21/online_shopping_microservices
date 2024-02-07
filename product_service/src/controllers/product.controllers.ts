import { StatusCode } from "@/constants/app.constants";
import ProductService from "@/services/product.services";
import QueueService from "@/services/queue.services";
import { IRequest } from "@/types";
import BigPromise from "@/utils/bigPromise";
import { NextFunction, Request, Response } from "express";

class ProductController {
  service: ProductService;
  queueService: QueueService;

  constructor() {
    this.service = new ProductService();
    this.queueService = new QueueService();
  }

  create = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      const { data } = await this.service.createProduct({
        name,
        type,
        unit,
        price,
        banner,
        suplier,
        available,
        description: desc,
      });
      return res.status(StatusCode.CREATED).json(data);
    },
  );

  getByCategory = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      const type = req.params.type;
      const { data } = await this.service.getProductsByCategory(type);
      return res.status(StatusCode.CREATED).json(data);
    },
  );

  getById = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      const id = req.params.id;
      const { data } = await this.service.getProductDetails(id);
      return res.status(StatusCode.CREATED).json(data);
    },
  );

  getByIds = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      const { ids } = await req.body;
      const { data } = await this.service.getProductsByIds(ids);
      return res.status(StatusCode.CREATED).json(data);
    },
  );

  addToWishlist = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const productPayload = await this.service.getProductPayload({
          customerId: req.user._id,
          productId: req.body._id,
          event: "ADD_TO_WISHLIST",
        });

        if (productPayload) {
          const { data } = productPayload;
          this.queueService.publishCustomerMessage(data);
          return res.status(StatusCode.CREATED).json(data.data.product);
        } else {
          return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
        }
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  removeFromWishlist = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const productPayload = await this.service.getProductPayload({
          customerId: req.user._id,
          productId: req.params.id,
          event: "REMOVE_FROM_WISHLIST",
        });

        if (productPayload) {
          const { data } = productPayload;
          this.queueService.publishCustomerMessage(data);
          return res.status(StatusCode.CREATED).json(data.data.product);
        } else {
          return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
        }
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  addToCart = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { _id, qty } = req.body;

        const productPayload = await this.service.getProductPayload({
          customerId: req.user._id,
          productId: _id,
          qty,
          event: "ADD_TO_CART",
        });

        if (productPayload) {
          const { data } = productPayload;

          this.queueService.publishCustomerMessage(data);
          this.queueService.publishShoppingMessage(data);

          return res
            .status(StatusCode.CREATED)
            .json({ product: data.data.product, unit: data.data.qty });
        } else {
          return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
        }
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  removeFromCart = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { qty } = req.body;
        const productPayload = await this.service.getProductPayload({
          customerId: req.user._id,
          productId: req.params.id,
          qty,
          event: "REMOVE_FROM_CART",
        });

        if (productPayload) {
          const { data } = productPayload;

          this.queueService.publishCustomerMessage(data);
          this.queueService.publishShoppingMessage(data);

          return res
            .status(StatusCode.CREATED)
            .json({ product: data.data.product, unit: data.data.qty });
        } else {
          return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
        }
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  getAllProducts = BigPromise(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const { data } = await this.service.getProducts();
      return res.status(StatusCode.CREATED).json(data);
    },
  );
}

export default ProductController;
