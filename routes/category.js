const express = require("express");
const router = express.Router();
const { uploadFileToFirebase } = require("../firebase/firebase");
const Category = require("../models/Category");
const Product=require('../models/Product')
const Cart=require('../models/Cart')
const Wishlist=require('../models/Wishlist')
const upload = require("../utils/multer");
const { isAdmin } = require("../middlewares/isAdmin");
const {ensureArray} =require("../utils/ensureArray")



// Route to create a new category
router.post("/new", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const imageFile = req.file;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Upload image to Firebase Storage (if provided)
    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadFileToFirebase(imageFile);
    }

    // Save the new category to the database
    const newCategory = new Category({ name, image: imageUrl });
    await newCategory.save();

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to update a category
router.put("/update/:category_id", isAdmin, upload.single("image"), async (req, res) => {
  const categoryId = req.params.category_id;

  try {
    const {
      name,
      colors,
      sizes,
      innerCategories,
      brands,
      priceRangeMin,
      priceRangeMax,
    } = req.body;

    const imageFile = req.file;

    // Validate input
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Check if the category with the provided ID exists
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if another category with the same name already exists (excluding the current category)
    const duplicateCategory = await Category.findOne({
      name,
      _id: { $ne: categoryId },
    });
    if (duplicateCategory) {
      return res.status(400).json({
        message: "Another category with the same name already exists",
      });
    }

    // Upload image to Firebase Storage (if provided)
    let imageUrl = existingCategory.image; // Retain the existing image URL by default
    if (imageFile) {
      imageUrl = await uploadFileToFirebase(imageFile);
    }

    // Ensure all fields are arrays
    const colorsArray = ensureArray(colors) || existingCategory.colors;
    const sizesArray = ensureArray(sizes) || existingCategory.sizes;
    const innerCategoriesArray = ensureArray(innerCategories) || existingCategory.innerCategories;
    const brandsArray = ensureArray(brands) || existingCategory.brands;

    // Create price range object
    const priceRange = {
      min: priceRangeMin
        ? parseFloat(priceRangeMin)
        : existingCategory.priceRange.min,
      max: priceRangeMax
        ? parseFloat(priceRangeMax)
        : existingCategory.priceRange.max,
    };

    // Update the category in the database
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      {
        name,
        image: imageUrl,
        colors: colorsArray,
        sizes: sizesArray,
        innerCategories: innerCategoriesArray,
        brands: brandsArray,
        priceRange,
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to delete a category
router.delete("/delete/:category_id", isAdmin, async (req, res) => {
  const categoryId = req.params.category_id;

  try {
    // Check if the category exists
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete the category
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get all categories
router.get("/all", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      message: "Categories fetched successfully",
      categories,
    });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:category_id", async (req, res) => {
  const categoryId = req.params.category_id;
  const page = parseInt(req.query.page) || 1; 
  const limit = 10; 

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch total number of products in the category
    const totalProducts = await Product.countDocuments({
      category: category._id,
    });

    const products = await Product.find({ category: category._id })
      .populate("category")
      .skip((page - 1) * limit) 
      .limit(limit); 

    const totalPages = Math.ceil(totalProducts / limit);
    let wishlist = [];
    if (req.isAuthenticated()) {
      wishlist = await Wishlist.find({ user: req.user._id }).select("product");
    }


    res.render("categories", {
      title: `Category - ${category.name}`,
      category,
      products, 
      productsShown: products.length, 
      totalProducts, 
      currentPage: page, 
      totalPages, 
      wishlist: wishlist.map((item) => item.product.toString()),
      isAuthenticated: req.isAuthenticated(),
    });
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;