const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { isAuthenticated } = require("../middlewares/auth");




// Get checkout details
router.get("/", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/?modal=signin");
    }

    const cartItems = await Cart.findOne({ user: req.user._id }).populate(
      "items.product"
    );

    if (!cartItems) {
      return res.status(404).render("404", { title: "Cart Not Found" });
    }

    res.render("checkout", {
      title: "Checkout",
      cartItems: cartItems,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
