const mongoose = require("mongoose");

// Review Sub-Schema
const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  images: {
    type: [String], // Array of image URLs or file paths
    default: [], // Optional field
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
    ref: "Category", // Reference to the Category model
    required: true,
  },
  superCategory: {
    type: String,
    enum: [
      "New Arrivals",
      "Recommendations for You",
      "Trending Products",
      "Deals",
      "Outlets",
    ], // Allowed values
    default: "New Arrivals", // Default value
  },
  reviews: [reviewSchema], // Array of review sub-documents
  tags: {
    type: [String], // Array of strings (e.g., ["sale", "top"])
    enum: ["top","sale","new"],
    default: [],
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Price cannot be negative
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  colors: {
    type: [String], // Single color (e.g., "Red")
    trim: true,
  },
  sizes: {
    type: [String], // Single size (e.g., "XL")
    trim: true,
  },
  additionalInfo: {
    type: String,
    trim: true,
  },
  shippingAndReturns: {
    type: String,
    trim: true,
  },
  brands: {
    type: [String], // Single brand (e.g., "Nike")
    trim: true,
  },
  priceRange: {
    type: Map, // Map of color to price range (e.g., { "black": { min: 50, max: 100 }, "yellow": { min: 60, max: 110 } })
    of: new mongoose.Schema({
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    }),
    default: {},
  },
  innerCategory: {
    type: [String], // Array of inner categories (e.g., ["Jeans", "T-Shirts"])
    default: [], // Optional field
  },
  stockStatus: {
    type: String,
    enum: ["In Stock", "Out of Stock"],
    default: "In Stock",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Product model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
