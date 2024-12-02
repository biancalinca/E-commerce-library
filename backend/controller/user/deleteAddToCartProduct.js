const addToCartModel = require("../../models/cartProduct")

const deleteAddToCartProduct = async(req, res) => {
    try {

        const currentUserId = req.userId
        const addToCartProductId = req.body._id // id-ul produsului specific din array-ul products
 
        // Găsim produsul pentru a obține cantitatea înainte de ștergere
        const userCart = await addToCartModel.findOne(
            { userId: currentUserId, "products._id": addToCartProductId },
            { "products.$": 1 }
        );

        const productQty = userCart.products[0].quantity

        // Găsim coșul utilizatorului și eliminăm produsul specific din array-ul products
        const deleteProduct = await addToCartModel.findOneAndUpdate(
            { userId: currentUserId },
            { 
                $pull: { products: { _id: addToCartProductId } },
                $inc: { totalQuantity: -productQty }
            },
            { new: true } // Returnează documentul actualizat
        );

        if (!deleteProduct) {
            return res.json({
                message: "Produsul nu a fost găsit sau coșul este gol.",
                success: false,
                error: true
            });
        }
         
          res.json({
             message: "Produs sterg din cos",
             data: deleteProduct,
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

module.exports = deleteAddToCartProduct