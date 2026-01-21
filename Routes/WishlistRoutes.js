import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  moveToCart
} from "../Controllers/WishlistController.js";
import verifyToken from "../Middlewares/VerifyToken.js";
import isUser from "../Middlewares/IsUser.js";

const router = express.Router();

router.post("/", verifyToken, isUser, addToWishlist);
router.get("/", verifyToken, isUser, getWishlist);
router.delete("/:productId", verifyToken, isUser, removeFromWishlist);
router.post("/move-to-cart", verifyToken, isUser, moveToCart);

export default router;
