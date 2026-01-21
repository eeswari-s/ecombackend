import express from "express";
import {
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus
} from "../Controllers/AdminOrderController.js";
import verifyToken from "../Middlewares/VerifyToken.js";
import isAdmin from "../Middlewares/IsAdmin.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllOrders);
router.get("/:id", verifyToken, isAdmin, getOrderByIdAdmin);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

export default router;
