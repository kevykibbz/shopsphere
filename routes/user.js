const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const { isAuthenticated } = require("../middlewares/auth");


// Login page
router.get('/login', async (req, res) => {
  res.render("login", { title: "Login" });
});

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "This email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login a user
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Login Error:", err); // Log the error
      return res.status(500).json({ message: "Server error" });
    }
    if (!user) {
      return res.status(400).json({ message: info.message });
    }

    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        console.error("Login Error:", err); // Log the error
        return res.status(500).json({ message: "Server error" });
      }
      return res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
});

// Logout a user
router.get("/", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout Error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.redirect("/");
  });
});

// Update user profile
router.post("/update-profile", isAuthenticated, async (req, res) => {
  const {
    name,
    username,
    email,
    current_password,
    new_password,
    confirm_password,
  } = req.body;
  const userId = req.user._id; 

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update name and username
    if (name) user.name = name;
    if (username) user.username = username;

    // Update password (if provided)
    if (current_password && new_password && confirm_password) {
      // Verify current password
      const isMatch = await bcrypt.compare(current_password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      // Verify new password and confirm password match
      if (new_password !== confirm_password) {
        return res
          .status(400)
          .json({ message: "New password and confirm password do not match" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(new_password, salt);
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Update billing address
router.post('/update-billing-address', isAuthenticated, async (req, res) => {
  const { billingAddress } = req.body;
  const userId = req.user._id; 

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the shipping address
    user.billingAddress = billingAddress;
    await user.save();

    res.status(200).json({ message: 'Billing address updated successfully' });
  } catch (err) {
    console.error('Error updating billing address:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update shipping address
router.post('/update-shipping-address', isAuthenticated, async (req, res) => {
  const { shippingAddress } = req.body;
  const userId = req.user._id; 

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.shippingAddress = shippingAddress;
    await user.save();

    res.status(200).json({ message: 'Shipping address updated successfully' });
  } catch (err) {
    console.error('Error updating shipping address:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
