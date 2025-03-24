const Cart = require("../models/Cart");

const fetchCart = async (req, res, next) => {
  try {
    let cart = [];
    if (req.isAuthenticated()) {
      const userCart = await Cart.findOne({ user: req.user._id }).populate(
        "items.product"
      );
      if (userCart) {
        cart = userCart.items; 
      }
    }
    res.locals.cart = cart; 
    next();
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).send("Server error");
  }
};

module.exports = fetchCart;
