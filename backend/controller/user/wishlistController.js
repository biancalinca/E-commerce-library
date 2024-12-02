// controllers/wishlistController.js

const WishlistModel = require("../../models/wishlistModel");

const addToWishlistController = async (req, res) => {
    try {
        const { productId } = req.body;
        const currentUser = req.userId;

        // Căutăm wishlist-ul utilizatorului curent
        let userWishlist = await WishlistModel.findOne({ userId: currentUser });

        if (!userWishlist) {
            // Dacă nu există un wishlist, creăm unul nou
            userWishlist = new WishlistModel({
                userId: currentUser,
                products: [{ productId }],
            });
        } else {
            // Verificăm dacă produsul există deja în wishlist
            const productExists = userWishlist.products.some(product => product.productId === productId);

            if (productExists) {
                return res.json({
                    message: "Produsul există deja în wishlist",
                    data: [],
                    error: true,
                    success: false
                });
            } else {
                // Dacă produsul nu există, îl adăugăm în array
                userWishlist.products.push({ productId });
            }
        }

        // Salvăm modificările
        const savedWishlist = await userWishlist.save();

        return res.json({
            message: "Produs adăugat în wishlist",
            data: savedWishlist,
            success: true,
            error: false,
        });
    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false,
        });
    }
};

const viewWishlistController = async(req, res) => {
    try {
        const currentUser = req.userId;
        const userWishlist = await WishlistModel.findOne({ userId: currentUser }).populate("products.productId");

        if (!userWishlist || userWishlist.products.length === 0) {
            return res.json({
                message: "Nu există produse în wishlist",
                data: [],
                success: true,
                error: false
            });
        }

        res.json({
            message: "Produse din wishlist",
            data: userWishlist,
            success: true,
            error: false
        });
    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = {
    addToWishlistController,
    viewWishlistController
};
