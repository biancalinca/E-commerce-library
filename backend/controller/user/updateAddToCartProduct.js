const addToCartModel = require("../../models/cartProduct")

const updateAddToCartProduct = async(req, res) => {
    try {

        const currentUserId = req.userId
        const addToCartProductId = req?.body?._id //id-ul prodului in baza de date
        const qty = req.body.quantity

        // Găsim produsul curent pentru a obține cantitatea veche
        const userCart = await addToCartModel.findOne(
            { userId: currentUserId, "products._id": addToCartProductId },
            { "products.$": 1 }
        );

        const oldQty = userCart.products[0].quantity;

        // Calculăm noua valoare a `totalQuantity`
        const totalQuantityChange = qty - oldQty;

        // Actualizăm cantitatea produsului specific în array-ul products
        const updateProduct = await addToCartModel.findOneAndUpdate(
            { userId: currentUserId, "products._id": addToCartProductId }, // Găsim produsul specific în coș
            { 
                $set: { "products.$.quantity": qty },
                $inc: { totalQuantity: totalQuantityChange  }
            
            }, // Setăm noua cantitate
            { new: true } // Returnează documentul actualizat
        );
        

        if (!updateProduct) {
            return res.json({
                message: "Produsul nu a fost găsit.",
                success: false,
                error: true
            });
        }

        
         res.json({
            message: "Produs actualizat in cos",
            data: updateProduct,
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

module.exports = updateAddToCartProduct