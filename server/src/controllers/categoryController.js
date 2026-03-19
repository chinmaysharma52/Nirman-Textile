import Category from "../models/Category.js";
import Product from "../models/Product.js";

// @desc    Get all categories with dynamic images and product counts
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    // For each category, get the first product image and number of products
    const categoriesWithDetails = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat.name });
        const firstProduct = await Product.findOne({ category: cat.name }).sort({ createdAt: -1 });

        return {
          _id: cat._id,
          name: cat.name,
          createdAt: cat.createdAt,
          productCount,
          imageUrl: firstProduct ? firstProduct.imageUrl : null,
        };
      })
    );

    res.json(categoriesWithDetails);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};
