import express from "express";
import proxy from "express-http-proxy";

const app = express();

app.get("/", (_req, res) => {
  return res
    .status(200)
    .json({ status: "OK", message: "Hello from API Gateway" });
});

app.get("/api/customer/*", proxy("http://localhost:8001"));
app.get("/api/product/*", proxy("http://localhost:8002"));
app.get("/api/shopping/*", proxy("http://localhost:8003"));

app.listen(8000, () => console.log(`API Gateway is running on PORT 8000`));
