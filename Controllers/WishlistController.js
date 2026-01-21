import Wishlist from "../Models/Wishlist.js";
import Product from "../Models/Product.js";
import Cart from "../Models/Cart.js";

/**
 * ADD TO WISHLIST
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
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

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [
          {
            product: product._id,
            name: product.name,
            image: product.images[0],
            price: product.offerPrice
          }
        ]
      });

      return res.status(201).json({
        success: true,
        wishlist
      });
    }

    const exists = wishlist.products.find(
      (item) => item.product.toString() === productId
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist"
      });
    }

    wishlist.products.push({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.offerPrice
    });

    await wishlist.save();

    return res.status(200).json({
      success: true,
      wishlist
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET USER WISHLIST
 */
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        products: []
      });
    }

    return res.status(200).json({
      success: true,
      products: wishlist.products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * REMOVE FROM WISHLIST
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found"
      });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();

    return res.status(200).json({
      success: true,
      products: wishlist.products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * MOVE WISHLIST ITEM TO CART
 */
export const moveToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: "Product ID and size are required"
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

    if (product.stock < 1) {
      return res.status(400).json({
        success: false,
        message: "Product out of stock"
      });
    }

    let cart = await Cart.findOne({ user: userId });
    const price = product.offerPrice;

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: product._id,
            name: product.name,
            image: product.images[0],
            size,
            quantity: 1,
            price,
            totalPrice: price
          }
        ],
        cartTotal: price
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          item.size === size
      );

      if (itemIndex > -1) {
        if (cart.items[itemIndex].quantity + 1 > product.stock) {
          return res.status(400).json({
            success: false,
            message: "Stock limit exceeded"
          });
        }

        cart.items[itemIndex].quantity += 1;
        cart.items[itemIndex].totalPrice =
          cart.items[itemIndex].quantity * price;
      } else {
        cart.items.push({
          product: product._id,
          name: product.name,
          image: product.images[0],
          size,
          quantity: 1,
          price,
          totalPrice: price
        });
      }

      cart.cartTotal = cart.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0
      );

      await cart.save();
    }

    // Remove from wishlist ONLY after cart success
    const wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (item) => item.product.toString() !== productId
      );
      await wishlist.save();
    }

    return res.status(200).json({
      success: true,
      message: "Moved to cart successfully",
      cart
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
