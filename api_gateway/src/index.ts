import express from "express";
import proxy from "express-http-proxy";

const app = express();

app.all("/api/customer/*", proxy("http://localhost:8001"));
app.all("/api/product/*", proxy("http://localhost:8002"));
app.all("/api/shopping/*", proxy("http://localhost:8003"));

app.get("/", (_req, res) => {
  return res
    .status(200)
    .json({ status: "OK", message: "Hello from API Gateway" });
});

app.listen(8000, () => console.log(`API Gateway is running on PORT 8000`));
