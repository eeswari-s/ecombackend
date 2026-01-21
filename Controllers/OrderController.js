import Cart from "../Models/Cart.js";
import Order from "../Models/Order.js";
import Product from "../Models/Product.js";
import User from "../Models/User.js";

import generateInvoicePdf from "../Utils/GenerateInvoicePdf.js";
import sendOrderEmail from "../Utils/SendOrderEmail.js";

/**
 * CREATE ORDER (AFTER PAYMENT SUCCESS)
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      fullName,
      phone,
      billingAddress,
      deliveryAddress,
      paymentIntentId
    } = req.body;

    if (
      !fullName ||
      !phone ||
      !billingAddress ||
      !deliveryAddress ||
      !paymentIntentId
    ) {
      return res.status(400).json({
        success: false,
        message: "All checkout fields are required"
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    // =========================
    // STOCK REDUCTION (CRITICAL)
    // =========================
    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found during order"
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    // =========================
    // CREATE ORDER
    // =========================
    const order = await Order.create({
      user: userId,
      items: cart.items,
      billingAddress,
      deliveryAddress,
      phone,
      subTotal: cart.cartTotal,
      totalAmount: cart.cartTotal,
      paymentMethod: "Stripe",
      paymentStatus: "Paid",
      paymentIntentId,
      orderStatus: "Pending"
    });

    // =========================
    // PDF + EMAIL (NON-BLOCKING)
    // =========================
    try {
      const user = await User.findById(userId);

      if (user) {
        const pdfBuffer = await generateInvoicePdf(order, user);
        await sendOrderEmail(user.email, order, pdfBuffer);
      }
    } catch (emailError) {
      console.error("Invoice email failed:", emailError.message);
      // IMPORTANT: Do NOT throw error
    }

    // =========================
    // CLEAR CART
    // =========================
    cart.items = [];
    cart.cartTotal = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET MY ORDERS (USER ORDER HISTORY)
 */
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET SINGLE ORDER DETAILS (OWN ORDER ONLY)
 */
export const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
