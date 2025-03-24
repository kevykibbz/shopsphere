const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const { uploadFileToFirebase } = require("../firebase/firebase");
const Product = require("../models/Product");
const Wishlist = require("../models/Wishlist");
const { isAdmin } = require("../middlewares/isAdmin");

// Route to create a new product
router.post("/new", isAdmin, upload.array("images", 5), async (req, res) => {
  try {
    const {
      name,
      category,
      superCategory,
      tags,
      price,
      description,
      brands,
      innerCategory,
      colors,
      sizes,
    } = req.body;

    const imageFiles = req.files; // Array of uploaded files

    // Validate input
    if (!name || !category || !price || !description) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    // Check if the product already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    // Upload images to Firebase Storage (if provided)
    let imageUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        const imageUrl = await uploadFileToFirebase(file);
        imageUrls.push(imageUrl);
      }
    }


    // Convert comma-separated strings to arrays (if provided)
    const tagsArray = Array.isArray(tags) ? tags : (tags ? tags.split(",").map(tag => tag.trim()) : []);
    const colorsArray = colors
      ? colors.split(",").map((color) => color.trim())
      : [];
    const sizesArray = sizes ? sizes.split(",").map((size) => size.trim()) : [];
    const brandsArray = brands
      ? brands.split(",").map((brand) => brand.trim())
      : [];
    const innerCategoriesArray = innerCategory
      ? innerCategory.split(",").map((ic) => ic.trim())
      : [];

    // Save the new product to the database
    const newProduct = new Product({
      name,
      images: imageUrls, // Array of image URLs
      category,
      superCategory,
      tags: tagsArray, // Array of tags
      price,
      description,
      colors: colorsArray, // Array of colors
      sizes: sizesArray, // Array of sizes
      brands: brandsArray, // Array of brands
      innerCategory: innerCategoriesArray, // Array of inner categories
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to add a product to the wishlist
router.post("/:id/wishlist", async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id; 

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the product is already in the user's wishlist
    const existingWishlistItem = await Wishlist.findOne({
      user: userId,
      product: productId,
    });
    if (existingWishlistItem) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    // Add the product to the wishlist
    const newWishlistItem = new Wishlist({
      user: userId,
      product: productId,
    });

    await newWishlistItem.save();

    res.status(201).json({
      message: "Product added to wishlist",
      wishlistItem: newWishlistItem,
    });
  } catch (err) {
    console.error("Error adding product to wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to remove a product from the wishlist
router.delete("/:id/wishlist", async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id; // Assuming the user is authenticated

    // Remove the product from the wishlist
    const deletedWishlistItem = await Wishlist.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!deletedWishlistItem) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlistItem: deletedWishlistItem,
    });
  } catch (err) {
    console.error("Error removing product from wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return res.status(404).render("404", { title: "Product Not Found" });
    }

    // Fetch related products based on the same category
    const relatedProducts = await Product.find({
      category: product.category._id, // Match the same category
      _id: { $ne: productId }, // Exclude the current product
    }).limit(15); // Limit the number of related products to 4 (you can adjust this)

    let wishlist = [];
    if (req.isAuthenticated()) {
      wishlist = await Wishlist.find({ user: req.user._id }).select("product");
    }

    res.render("product", {
      title: `Product - ${product.name}`,
      product,
      relatedProducts, // Pass related products to the template
      isAuthenticated: req.isAuthenticated(),
      wishlist: wishlist.map((item) => item.product.toString()), // Array of product IDs in the wishlist
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).render("500", { title: "Server Error" });
  }
});


// PATCH /api/products/:id - Edit a product
router.patch("/:id", isAdmin,async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete("/:id", isAdmin,async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;