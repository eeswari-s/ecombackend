import Review from "../Models/Review.js";
import Product from "../Models/Product.js";

/**
 * Helper: Recalculate product rating
 */
const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({
    product: productId,
    isActive: true
  });

  const totalRatings = reviews.length;

  let averageRating = 0;
  if (totalRatings > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    averageRating = Number((sum / totalRatings).toFixed(1));
  }

  await Product.findByIdAndUpdate(productId, {
    averageRating,
    totalRatings
  });
};

/**
 * ADD REVIEW (USER)
 */
export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Product and rating are required"
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
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

    // Create review (unique index prevents duplicates)
    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment
    });

    // Recalculate product rating
    await recalculateProductRating(productId);

    return res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    // Duplicate review error (unique index)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product"
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET PRODUCT REVIEWS (PUBLIC)
 */
export const getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviews = await Review.find({
      product: productId,
      isActive: true
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
