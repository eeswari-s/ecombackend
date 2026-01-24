import express from "express";
import {
  disableReview,
  deleteReview,
   getAllReviewsForAdmin 
} from "../Controllers/AdminReviewController.js";
import verifyToken from "../Middlewares/VerifyToken.js";
import isAdmin from "../Middlewares/IsAdmin.js";

const router = express.Router();

router.patch("/:id/disable", verifyToken, isAdmin, disableReview);
router.delete("/:id", verifyToken, isAdmin, deleteReview);

//admin review
router.get("/", verifyToken, isAdmin, getAllReviewsForAdmin);

export default router;
