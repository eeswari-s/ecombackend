import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Saree",
        "Half Saree",
        "Chudidar",
        "Men Shirt",
        "Men T-Shirt",
        "Men Pant",
        "Kids Frock",
        "Kids Shirt",
        "Kids Pant"
      ]
    },
    images: [
      {
        type: String,
        required: true
      }
    ],
    price: {
      type: Number,
      required: true
    },
    offerPercentage: {
      type: Number,
      default: 0
    },
    offerPrice: {
      type: Number,
      required: true
    },
    sizes: [
      {
        type: String
      }
    ],
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
