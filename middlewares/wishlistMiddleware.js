const Wishlist = require("../models/Wishlist");

const fetchWishlist = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const wishlist = await Wishlist.find({ user: req.user._id }).select("product");
      res.locals.wishlist = wishlist.map((item) => item.product.toString());
    } else {
      res.locals.wishlist = [];
    }
    next();
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.locals.wishlist = [];
    next();
  }
};

module.exports = fetchWishlist;