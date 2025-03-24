const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const { isAuthenticated } = require("../middlewares/auth");

// Add to Wishlist
router.post("/add", isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Check if the product is already in the wishlist
    const existingWishlistItem = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (existingWishlistItem) {
      return res
        .status(400)
        .json({ message: "Product is already in your wishlist" });
    }

    // Add the product to the wishlist
    const newWishlistItem = new Wishlist({ user: userId, product: productId });
    await newWishlistItem.save();

    res
      .status(201)
      .json({
        message: "Product added to wishlist",
        wishlistItem: newWishlistItem,
      });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from Wishlist
router.post("/remove", isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    // Remove the product from the wishlist
    await Wishlist.findOneAndDelete({ user: userId, product: productId });

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/?modal=signin"); 
    }

    // Find and delete the wishlist item
    const deletedItem = await Wishlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id, 
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Wishlist item not found" });
    }

    res.status(200).json({ message: "Product removed from wishlist" });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/?modal=signin");
    }

    const wishlistItems = await Wishlist.find({ user: req.user._id })
      .populate("product") // Populate the product details
      .exec();
    res.render("wishlist", {
      title: "Wishlist",
      wishlistItems,
    });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
