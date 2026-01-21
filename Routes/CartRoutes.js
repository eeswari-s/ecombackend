import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem
} from "../Controllers/CartController.js";
import verifyToken from "../Middlewares/VerifyToken.js";
import isUser from "../Middlewares/IsUser.js";

const router = express.Router();

router.post("/", verifyToken, isUser, addToCart);
router.get("/", verifyToken, isUser, getCart);
router.put("/:productId", verifyToken, isUser, updateCartItem);
router.delete("/:productId", verifyToken, isUser, removeCartItem);

export default router;
