// Load environment variables
import "dotenv/config";

// Core imports
import express from "express";
import cors from "cors";

// Database
import connectDatabase from "./Config/Database.js";

// Routes
import authRoutes from "./Routes/AuthRoutes.js";
import adminAuthRoutes from "./Routes/AdminAuthRoutes.js";

import productRoutes from "./Routes/ProductRoutes.js";
import adminProductRoutes from "./Routes/AdminProductRoutes.js";

import cartRoutes from "./Routes/CartRoutes.js";
import wishlistRoutes from "./Routes/WishlistRoutes.js";

import paymentRoutes from "./Routes/PaymentRoutes.js";

import orderRoutes from "./Routes/OrderRoutes.js";
import adminOrderRoutes from "./Routes/AdminOrderRoutes.js";

import reviewRoutes from "./Routes/ReviewRoutes.js";
import adminReviewRoutes from "./Routes/AdminReviewRoutes.js";

// ==============================
// Initialize Express App
// ==============================
const app = express();

// ==============================
// Database Connection
// ==============================
connectDatabase();

// ==============================
// Global Middlewares
// ==============================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

// ==============================
// Health Check / Wake-up Route
// ==============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Dress Shop Backend API is running 🚀"
  });
});

// ==============================
// API Routes
// ==============================

// Auth
app.use("/api/auth", authRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

// Products
app.use("/api/products", productRoutes);
app.use("/api/admin/products", adminProductRoutes);

// Cart & Wishlist
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

// Payment
app.use("/api/payment", paymentRoutes);

// Orders
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// Reviews
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin/reviews", adminReviewRoutes);

// ==============================
// Server Start
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("======================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("📦 Dress Shop Backend is LIVE");
  console.log("======================================");
});
