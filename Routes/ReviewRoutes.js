import express from "express";
import {
  addReview,
  getProductReviews
} from "../Controllers/ReviewController.js";
import verifyToken from "../Middlewares/VerifyToken.js";
import isUser from "../Middlewares/IsUser.js";

const router = express.Router();

// User adds review
router.post("/", verifyToken, isUser, addReview);

// Public product reviews
router.get("/product/:productId", getProductReviews);

export default router;
