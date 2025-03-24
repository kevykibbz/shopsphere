const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.redirect("/?modal=signin");
    }
    // Fetch orders for the authenticated user
    const orders = await Order.find({ user: req.user._id }).populate("items.product");

    res.render("dashboard", {
      title: "Dashboard",
      orders, 
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;