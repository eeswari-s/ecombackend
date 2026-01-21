import Cart from "../Models/Cart.js";
import stripe from "../Config/Stripe.js";

/**
 * CREATE STRIPE PAYMENT INTENT
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty"
      });
    }

    const amount = Math.round(cart.cartTotal * 100); // INR paise

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: process.env.STRIPE_CURRENCY,
      metadata: {
        userId
      }
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
