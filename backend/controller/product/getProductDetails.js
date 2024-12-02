const productModel = require("../../models/productModel")

const getProductDetails = async(req, res) => {
    try{
        const { productId } = req.body

        const product = await productModel.findById(productId)
       
        //raspuns pentru client 
        res.json({
            message: "Produsul individual",
            data: product,
            error: false,
            success: true
        })

    } catch (err) {
        // În cazul unei erori, returnează un mesaj de eroare
        res.status(500).json({
            message: err?.message || "A apărut o eroare la preluarea produsului.",
            error: true,
            success: false,
        });
    }
}

module.exports = getProductDetails