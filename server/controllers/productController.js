import mongoose from "mongoose";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

// @desc    Get all products (supports ?group=..., ?category=..., ?search=...)
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { group, category, search } = req.query;
    const filter = {};

    if (group) filter.collectionGroup = String(group);
    if (category && category !== "all") filter.category = String(category);
    if (search) {
      filter.$or = [
        { name: { $regex: String(search), $options: "i" } },
        { description: { $regex: String(search), $options: "i" } },
        { category: { $regex: String(search), $options: "i" } },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: 1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product + its reviews
// @route   GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    const reviews = await Review.find({ product: id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, product, reviews });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a customer reflection (review) to a product
// @route   POST /api/products/:id/reviews
export const createReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    const product = await Product.findById(id);
    if (!product) {
      res.status(404);
      return next(new Error("Product not found"));
    }

    const review = await Review.create({
      product: id,
      user: req.user?._id || null,
      authorName: req.body.authorName,
      rating: req.body.rating,
      title: req.body.title,
      body: req.body.body,
      topics: req.body.topics.length ? req.body.topics : ["satisfaction", "quality"],
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    next(err);
  }
};