const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    image: {
        type: String, 
        default: null, 
    },
    colors: {
        type: [String], // Array of colors (e.g., ["Red", "Blue", "Yellow"])
        default: [],
    },
    sizes: {
        type: [String], // Array of sizes (e.g., ["S", "M", "L", "XL"])
        default: [],
    },
    innerCategories: {
        type: [String], // Array of sub-categories (e.g., ["T-Shirts", "Dresses", "Shoes"])
        default: [],
    },
    brands: {
        type: [String], // Array of brands (e.g., ["Gucci", "Nike", "Adidas"])
        default: [],
    },
    priceRange: {
        type: {
            min: { type: Number, default: 0 }, // Minimum price
            max: { type: Number, default: Infinity }, // Maximum price
        },
        default: { min: 0, max: Infinity }, // Default price range
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Category', categorySchema);