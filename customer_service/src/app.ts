import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { customerRoutes, healthcheckRoutes } from "@/routes";
import errorHandler from "@/middleware/errorHandler";

const app = express();

// middlewares
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(helmet());

// routes
app.use("/customer", healthcheckRoutes);
app.use("/customer", customerRoutes);

// error handling
app.use(errorHandler);

export default app;
