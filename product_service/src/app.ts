import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { healthcheckRoutes, productRoutes } from "@/routes";
import errorHandler from "@/middleware/errorHandler";

const app = express();

// middlewares
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(helmet());

// routes
app.use("/product", healthcheckRoutes);
app.use("/product", productRoutes);

// error handling
app.use(errorHandler);

export default app;
