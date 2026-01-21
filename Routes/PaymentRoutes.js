import express from "express";
import { createPaymentIntent } from "../Controllers/PaymentController.js";
import verifyToken from "../Middlewares/VerifyToken.js";
import isUser from "../Middlewares/IsUser.js";

const router = express.Router();

router.post("/create-intent", verifyToken, isUser, createPaymentIntent);

export default router;
