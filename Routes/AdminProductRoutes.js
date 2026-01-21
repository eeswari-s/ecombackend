import express from "express";
import {
  addProduct,
  updateProduct,
  disableProduct,
  getAllProductsAdmin
} from "../Controllers/ProductController.js";
import verifyToken from "../Middlewares/VerifyToken.js";
import isAdmin from "../Middlewares/IsAdmin.js";

const router = express.Router();

router.post("/", verifyToken, isAdmin, addProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.patch("/:id/disable", verifyToken, isAdmin, disableProduct);
router.get("/", verifyToken, isAdmin, getAllProductsAdmin);

export default router;
