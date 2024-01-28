import { ProductControllers } from "@/controllers";
import auth from "@/middleware/auth";
import { Router } from "express";

const router = Router();
const Product = new ProductControllers();

router.post("/create", Product.create);
router.post("/ids", Product.getByIds);
router.put("/wishlist", auth, Product.addToWishlist);
router.delete("/wishlist/:id", auth, Product.removeFromWishlist);
router.put("/cart", auth, Product.addToCart);
router.delete("/cart/:id", auth, Product.removeFromCart);
router.get("/all", Product.getAllProducts);
router.get("/category/:type", Product.getByCategory);
router.get("/:id", Product.getById);

export default router;
