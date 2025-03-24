const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const allowedSuperCategories = [
      "New Arrivals",
      "Recommendations for You",
      "Deals",
      "Outlets",
    ];

    const products = await Product.find({
      superCategory: { $in: allowedSuperCategories },
    }).populate("category");

    // Group products by superCategory
    const groupedProducts = {};
    allowedSuperCategories.forEach((category) => {
      groupedProducts[category] = products.filter(
        (product) => product.superCategory === category
      );
    });
    res.render("index", {
      title: "Home",
      groupedProducts,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).render("error", { error: "Failed to load products" });
  }
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us" });
});

router.get("/faq", (req, res) => {
  res.render("faq", { title: "FAQs" });
});

module.exports = router;
