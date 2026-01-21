import Product from "../Models/Product.js";

/**
 * ADMIN: Add Product
 */
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      images,
      price,
      offerPercentage,
      sizes,
      stock
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      !images ||
      !price ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const discount = offerPercentage || 0;
    const offerPrice = price - (price * discount) / 100;

    const product = await Product.create({
      name,
      description,
      category,
      images,
      price,
      offerPercentage: discount,
      offerPrice,
      sizes,
      stock
    });

    return res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ADMIN: Update Product
 */
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    if (updateData.price && updateData.offerPercentage !== undefined) {
      updateData.offerPrice =
        updateData.price -
        (updateData.price * updateData.offerPercentage) / 100;
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ADMIN: Disable Product (Soft delete)
 */
export const disableProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product disabled successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * ADMIN: Get All Products
 */
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * PUBLIC: Get Active Products
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * PUBLIC: Get Product By ID
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
