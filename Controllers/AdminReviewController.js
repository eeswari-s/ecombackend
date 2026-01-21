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
 * DISABLE REVIEW (ADMIN)
 */
export const disableReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    review.isActive = false;
    await review.save();

    await recalculateProductRating(review.product);

    return res.status(200).json({
      success: true,
      message: "Review disabled successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * DELETE REVIEW (ADMIN)
 */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    const productId = review.product;
    await review.deleteOne();

    await recalculateProductRating(productId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
