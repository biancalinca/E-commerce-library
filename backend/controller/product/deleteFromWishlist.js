const WishlistModel = require("../../models/wishlistModel");

const deleteWishlistProduct = async(req, res) => {
    try {
        const currentUserId = req.userId;
        const wishlistProductId = req.body._id; // id-ul produsului specific din array-ul products

        // Găsim wishlist-ul utilizatorului și eliminăm produsul specific din array-ul products
        const deleteProduct = await WishlistModel.findOneAndUpdate(
            { userId: currentUserId },
            { 
                $pull: { products: { _id: wishlistProductId } }
            },
            { new: true } // Returnează documentul actualizat
        );

        if (!deleteProduct) {
            return res.json({
                message: "Produsul nu a fost găsit sau wishlist-ul este gol.",
                success: false,
                error: true
            });
        }
         
        res.json({
            message: "Produs șters din wishlist",
            data: deleteProduct,
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
};

module.exports = deleteWishlistProduct;
