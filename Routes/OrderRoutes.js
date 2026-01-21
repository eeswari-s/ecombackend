import express from "express";
import { createOrder,  getMyOrders,
  getOrderById } from "../Controllers/OrderController.js";
import verifyToken from "../Middlewares/VerifyToken.js";
import isUser from "../Middlewares/IsUser.js";

const router = express.Router();

router.post("/", verifyToken, isUser, createOrder);
router.get("/my", verifyToken, isUser, getMyOrders);
router.get("/:id", verifyToken, isUser, getOrderById);

export default router;
