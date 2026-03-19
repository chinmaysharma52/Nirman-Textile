import Product from "../models/Product.js";

export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; // default 12 items per page
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.category) {
      query.category = req.query.category;
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Only fetch total if needed? 
    // Actually the frontend expects an array right now. Let's return just products to not break it, 
    // or modify it if needed. The frontend map expects an array. I'll just return the array to avoid breaking the frontend entirely, but the proper way is { products, total, page }.
    // Let's just return the array but respect limit and page for performance.
    
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { title, price, description, imageUrl, category } = req.body;

    if (!title || price == null || !description || !imageUrl) {
      return res.status(400).json({
        message: "Title, price, description and imageUrl are required",
      });
    }

    const product = await Product.create({
      title,
      price,
      description,
      imageUrl,
      category: category || "Uncategorized",
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updates = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    Object.keys(updates).forEach((key) => {
      product[key] = updates[key];
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    next(error);
  }
};

