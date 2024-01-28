import { StatusCode } from "@/constants/app.constants";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/healthcheck", (_req: Request, res: Response) => {
  return res.status(StatusCode.OK).json({ status: "OK", message: "healthy" });
});

export default router;
