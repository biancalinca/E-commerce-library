const mongoose = require('mongoose'); // Import the mongoose library

// Define the product schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    pageNumber: {
        type: Number
        
    },
    inStock: {
        type: Boolean,
        default: false,
    },
    stock: {
        type: Number,
    },
    bookImage: {
        type: [String],
    },
    publicationYear: {
        type: Number,
    },
    category: {
        type: String,
        required: true,
    },
    publisher: {
        type: String,

    },
    edition: {
        type: String,

    },
    ISBN: {
        type: String,

    },
    librarianRecommendations: {
        type: [String],

    },
    promotions: {
        type: [String],
    },
    totalReviews: {
        type: Number,
        default: 0, // Initial numărul de review-uri este 0
    },
    totalRating: {
        type: Number,
        default: 0, // Inițial, suma rating-urilor este 0
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Create the model from the schema
const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
