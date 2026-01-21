import express from "express";
import {
  disableReview,
  deleteReview
} from "../Controllers/AdminReviewController.js";
import verifyToken from "../Middlewares/VerifyToken.js";
import isAdmin from "../Middlewares/IsAdmin.js";

const router = express.Router();

router.patch("/:id/disable", verifyToken, isAdmin, disableReview);
router.delete("/:id", verifyToken, isAdmin, deleteReview);

export default router;
