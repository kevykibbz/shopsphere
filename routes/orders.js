const express = require("express");
const Order = require("../models/Order");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");

// POST /api/orders - Create a new order
router.post("/", isAuthenticated,async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:order_id",async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
          return res.redirect("/?modal=signin");
    }

    const { order_id } = req.params;
    const order = await Order.findById(order_id).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("order:",order)

    res.render("orders", {
      title: "Orders",
      order
    });

  } catch (err) {
    console.error("Error getting order details:", err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;