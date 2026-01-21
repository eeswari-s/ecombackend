import Cart from "../Models/Cart.js";
import Product from "../Models/Product.js";

/**
 * ADD ITEM TO CART
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size, quantity } = req.body;

    if (!productId || !size || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product, size and quantity are required"
      });
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock"
      });
    }

    let cart = await Cart.findOne({ user: userId });

    const price = product.offerPrice;

    if (!cart) {
      // Create new cart
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: product._id,
            name: product.name,
            image: product.images[0],
            size,
            quantity,
            price,
            totalPrice: quantity * price
          }
        ],
        cartTotal: quantity * price
      });

      return res.status(201).json({
        success: true,
        cart
      });
    }

    // Cart exists
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size
    );

    if (itemIndex > -1) {
      const newQty = cart.items[itemIndex].quantity + quantity;

      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: "Stock limit exceeded"
        });
      }

      cart.items[itemIndex].quantity = newQty;
      cart.items[itemIndex].totalPrice = newQty * price;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        size,
        quantity,
        price,
        totalPrice: quantity * price
      });
    }

    cart.cartTotal = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET USER CART
 */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: null
      });
    }

    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * UPDATE CART ITEM QUANTITY
 */
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const productId = req.params.productId;
    const userId = req.user.id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    const product = await Product.findById(productId);

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Stock limit exceeded"
      });
    }

    item.quantity = quantity;
    item.totalPrice = quantity * item.price;

    cart.cartTotal = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * REMOVE ITEM FROM CART
 */
export const removeCartItem = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.cartTotal = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
