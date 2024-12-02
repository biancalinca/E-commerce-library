const wishlistModel = require("../../models/wishlistModel");

const countAddToWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        const count = await wishlistModel.aggregate([
            { $match: { userId: userId } }, // Filtrăm produsele în funcție de userId
            { $unwind: "$products" }, // Despachetăm array-ul de produse
            { $group: { _id: null, totalProducts: { $sum: 1 } } } // Calculăm numărul de produse
        ]);

        const totalProducts = count.length > 0 ? count[0].totalProducts : 0; // Obținem numărul sau 0 dacă nu există produse

        res.json({
            message: "Numărul de produse din wishlist",
            data: {
                count: totalProducts
            },
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

module.exports = countAddToWishlist;
