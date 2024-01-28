import { StatusCode } from "@/constants/app.constants";
import CustomerService from "@/services/customer.services";
import { IRequest } from "@/types";
import BigPromise from "@/utils/bigPromise";
import { NextFunction, Request, Response } from "express";

const customerService = new CustomerService();

class CustomerController {
  signup = BigPromise(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email, password, phone } = req.body;
      const { data } = await customerService.signUp({ email, phone, password });
      return res.status(StatusCode.CREATED).json(data);
    },
  );

  login = BigPromise(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { email, password } = req.body;
      const data = await customerService.signIn({ email, password });
      return res.status(StatusCode.OK).json(data?.data);
    },
  );

  address = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { _id } = req.user;
        const { street, postalCode, city, country } = req.body;
        const { data } = await customerService.addNewAddress({
          customerId: _id,
          city,
          street,
          country,
          postalCode,
        });

        return res.status(StatusCode.OK).json(data);
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  profile = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { _id } = req.user;
        const { data } = await customerService.getProfile(_id);
        return res.status(StatusCode.OK).json(data);
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  shoppingDetails = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { _id } = req.user;
        const { data } = await customerService.getProfile(_id);
        return res.status(StatusCode.OK).json(data);
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );

  wishlist = BigPromise(
    async (req: IRequest, res: Response, _next: NextFunction) => {
      if (req.user) {
        const { _id } = req.user;
        const { data } = await customerService.getWishlist(_id);
        return res.status(StatusCode.OK).json(data);
      }
      return res.status(StatusCode.SERVER_ERROR).json({ status: "ERROR" });
    },
  );
}

export default CustomerController;
