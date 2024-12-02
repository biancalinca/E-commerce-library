// const mongoose = require('mongoose'); // Import the mongoose library

// // Define the product schema
// const addToCart = new mongoose.Schema({
//     productId : {
//         ref : "Product",
//         type : String,
//     },
//     quantity : Number,
//     userId : String,
// }, {
//     timestamps: true // Adds createdAt and updatedAt timestamps
// });

// // Create the model from the schema
// const addToCartModel = mongoose.model('cart', addToCart);

// module.exports = addToCartModel;
const mongoose = require('mongoose');

// Definirea schemei pentru coșul de cumpărături
const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true, // Fiecare utilizator va avea un singur coș
    },
    totalQuantity: {
        type: Number,
        default: 0,
    },
    products: [{
        productId: {
            ref: "Product",
            type: String,
        },
        quantity: {
            type: Number,
            default: 1,
        },
    }],
}, {
    timestamps: true // Adăugare de timestamps pentru createdAt și updatedAt
});


// Crearea modelului din schema
const addToCartModel = mongoose.model('Cart', cartSchema);

module.exports = addToCartModel;
