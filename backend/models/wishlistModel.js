// models/wishlist.js

const mongoose = require('mongoose');

// Definirea schemei pentru wishlist
const wishlistSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true, // Fiecare utilizator va avea un singur wishlist
    },
    totalProducts: {
        type: Number,
        default: 0,
    },
    products: [{
        productId: {
            ref: "Product",
            type: String,
        }
    }],
}, {
    timestamps: true // Adăugare de timestamps pentru createdAt și updatedAt
});

// Crearea modelului din schema
const WishlistModel = mongoose.model('Wishlist', wishlistSchema);

module.exports = WishlistModel;
