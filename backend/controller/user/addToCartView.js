const addToCartModel = require("../../models/cartProduct")


const addToCartView = async(req, res) => {
    try {

        const currentUser = req.userId

        // const allProduct = await addToCartModel.find({userId : currentUser}).populate("productId")
        const allProduct = await addToCartModel.findOne({userId : currentUser}).populate("products.productId")

        //am adugat doar acest if acum 1:30
        if (!allProduct || allProduct.products.length === 0) {
            return res.json({
                message: "Nu există produse în coșul de cumpărături",
                data: [],
                success: true,
                error: false
            });
        }
        
        res.json({
            message: "Produse din cosul de cumparaturi",
            data: allProduct,
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

module.exports = addToCartView