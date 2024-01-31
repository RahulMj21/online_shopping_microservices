import { StatusCode } from "@/constants/app.constants";
import ProductService from "@/services/product.services";
import { IRequest } from "@/types";
import BigPromise from "@/utils/bigPromise";
import { Logger } from "@/utils/logger";
import { NextFunction, Request, Response } from "express";
import { publishCustomerEvent, publishShoppingEvent } from "@/utils";

const productService = new ProductService();

class ProductController {
  create = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      const { name, desc, type, unit, price, available, suplier, banner } =
        req.body;
      const { data } = await productService.createProduct({
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
      const { data } = await productService.getProductsByCategory(type);
      return res.status(StatusCode.CREATED).json(data);
    },
  );

  getById = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      const id = req.params.id;
      const { data } = await productService.getProductDetails(id);
      return res.status(StatusCode.CREATED).json(data);
    },
  );

  getByIds = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      const { ids } = await req.body;
      const { data } = await productService.getProductsByIds(ids);
      return res.status(StatusCode.CREATED).json(data);
    },
  );

  addToWishlist = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const productPayload = await productService.getProductPayload({
          customerId: req.user._id,
          productId: req.body._id,
          event: "ADD_TO_WISHLIST",
        });

        if (productPayload) {
          const { data } = productPayload;
          publishCustomerEvent(data);
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
        const productPayload = await productService.getProductPayload({
          customerId: req.user._id,
          productId: req.params.id,
          event: "REMOVE_FROM_WISHLIST",
        });

        if (productPayload) {
          const { data } = productPayload;
          publishCustomerEvent(data);
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

        const productPayload = await productService.getProductPayload({
          customerId: req.user._id,
          productId: _id,
          qty,
          event: "ADD_TO_CART",
        });

        if (productPayload) {
          const { data } = productPayload;

          publishCustomerEvent(data);
          publishShoppingEvent(data);

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
        const productPayload = await productService.getProductPayload({
          customerId: req.user._id,
          productId: req.params.id,
          qty,
          event: "REMOVE_FROM_CART",
        });

        if (productPayload) {
          const { data } = productPayload;

          publishCustomerEvent(data);
          publishShoppingEvent(data);

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
      const { data } = await productService.getProducts();
      return res.status(StatusCode.CREATED).json(data);
    },
  );

  events = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (!req.body.payload) {
        return res.status(StatusCode.BAD_REQUEST).json({ status: "ERROR" });
      }

      const { payload } = req.body;
      Logger.info("===========Product Service Received Event===========");

      return res.status(StatusCode.CREATED).json(payload);
    },
  );
}

export default ProductController;
