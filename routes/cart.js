const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Wishlist = require("../models/Wishlist");
const { isAuthenticated } = require("../middlewares/auth");

// Add to Cart and Remove from Wishlist
router.post("/add", isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const wishlistItem = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (wishlistItem) {
      await Wishlist.deleteOne({ _id: wishlistItem._id });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists in the cart, update the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Product does not exist in the cart, add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(200).json({
      message: "Product added to cart and removed from wishlist",
      cart,
    });
  } catch (err) {
    console.error("Error adding product to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove product from cart
router.post("/remove", isAuthenticated, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (err) {
    console.error("Error removing product from cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get cat items
router.get("/", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/?modal=signin");
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.render("cart", {
      title: "Your Cart",
      cart: cart.items,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/update", isAuthenticated, async (req, res) => {
  const { updates, shippingOption, shippingCost } = req.body;
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Update cart items
    updates.forEach((update) => {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === update.productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = update.quantity;
      }
    });

    // Update shipping option and cost
    if (shippingOption && shippingCost !== undefined) {
      cart.shippingOption = shippingOption;
      cart.shippingCost = shippingCost;
    }

    await cart.save();

    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
