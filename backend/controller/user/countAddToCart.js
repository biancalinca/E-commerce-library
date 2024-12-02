const addToCartModel = require("../../models/cartProduct")

const countAddToCart = async(req, res) => {
    try {

        const userId = req.userId
        const count = await addToCartModel.aggregate([
            { $match: { userId: userId } }, // Filtrăm produsele în funcție de userId
            { $unwind: "$products" }, // Despachetăm array-ul de produse
            { $group: { _id: null, totalQuantity: { $sum: "$products.quantity" } } } // Calculăm suma cantităților
        ]);
        
        const totalQuantity = count.length > 0 ? count[0].totalQuantity : 0; // Obținem suma sau 0 dacă nu există produse

         res.json({
            message: "Produs adaugat in cos",
            data: {
                count : totalQuantity
            },
            success: true,
            error: false
        })
    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = countAddToCart