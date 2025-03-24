const express = require("express");
const connectDB = require("./db");
const mongoose = require('mongoose'); 
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const fetchWishlist = require("./middlewares/wishlistMiddleware");
const fetchCart = require("./middlewares/cartMiddleware");
const app = express();
const PORT = process.env.APP_PORT || 3000;

// Load models
const Category = require("./models/Category");
const User = require("./models/User");

// Set up EJS and express-ejs-layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");
app.use(express.static(path.join(__dirname, "public")));
app.locals.phone_number = process.env.PHONE_NUMBER || "+123-456-7890";

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session configuration
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Middleware to make user data available in templates
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = req.user || null;
  next();
});


// Connect to MongoDB
connectDB();

// Middleware to fetch categories and make them available in all templates
app.use(async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.locals.categories = categories;
    next();
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send("Server error");
  }
});

// Middleware to fetch wishlist for authenticated users
app.use(fetchWishlist);
app.use(fetchCart);

// Routes
const indexRoutes = require("./routes/index");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const userRoutes = require("./routes/user");
const wishListRoutes = require("./routes/wishList");
const cartRoutes=require("./routes/cart");
const checkoutRoutes=require("./routes/checkout");
const dashboardRoutes=require("./routes/dashboard");
const orderRoutes=require("./routes/orders");
const searchRoutes = require("./routes/search");


app.use("/", indexRoutes);
app.use("/faq", indexRoutes);
app.use("/about", indexRoutes);
app.use("/contact", indexRoutes);
app.use("/product", productRoutes);
app.use("/api/products", productRoutes);
app.use("/category", categoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/account", userRoutes);
app.use("/logout", userRoutes);
app.use("/wishlist", wishListRoutes);
app.use("/api/wishlist", wishListRoutes);
app.use("/api/cart", cartRoutes)
app.use("/cart", cartRoutes)
app.use("/checkout", checkoutRoutes)
app.use("/dashboard", dashboardRoutes)
app.use("/api/orders", orderRoutes)
app.use("/orders", orderRoutes)
app.use("/api/search", searchRoutes);


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// All other routes (404 - Not Found)
app.use((req, res) => {
  res.status(404).render("404", { title: "404 - Page Not Found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on:${PORT}`);
});