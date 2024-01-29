import { CustomerControllers } from "@/controllers";
import auth from "@/middleware/auth";
import { Router } from "express";

const router = Router();
const Customer = new CustomerControllers();

// api endpoints
router.post("/signup", Customer.signup);
router.post("/login", Customer.login);
router.post("/address", auth, Customer.address);
router.get("/profile", auth, Customer.profile);
router.get("/shopping-details", auth, Customer.shoppingDetails);
router.get("/wishlist", auth, Customer.wishlist);

// events endpoint
router.post("/app-events", Customer.events);

export default router;
