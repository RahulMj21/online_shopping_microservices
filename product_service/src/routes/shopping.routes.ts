import { ShoppingControllers } from "@/controllers";
import auth from "@/middleware/auth";
import { Router } from "express";

const router = Router();
const Shopping = new ShoppingControllers();

router.post("/order", auth, Shopping.placeOrder);
router.get("/orders", auth, Shopping.getShoppingOrders);
router.get("/cart", auth, Shopping.getShoppingCart);

export default router;
