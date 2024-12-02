const mongoose = require('mongoose');

// Schema pentru Review
const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    reviews: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            comment: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        }
    ]
}, {
    timestamps: true // Adaugă createdAt și updatedAt
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;
