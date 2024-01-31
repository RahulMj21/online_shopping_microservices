import express from "express";
import proxy from "express-http-proxy";
import { Logger } from "@/utils/logger";

const app = express();

app.use((req, _res, next) => {
  Logger.info(`${req.method} ==> ${req.path}`);
  next();
});

app.get("/healthcheck", (_req, res) => {
  return res
    .status(200)
    .json({ status: "OK", message: "Hello from API Gateway" });
});

app.all("/customer/*", proxy("http://localhost:8001"));
app.all("/product/*", proxy("http://localhost:8002"));
app.all("/shopping/*", proxy("http://localhost:8003"));

app.listen(8000, () => Logger.info(`API Gateway running on PORT 8000`));
