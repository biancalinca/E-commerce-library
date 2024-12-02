const productModel = require("../../models/productModel")

const getCategoryProductAll = async(req, res) => {

    try{

        const {category} = req?.body || req?.query
        const product = await productModel.find({category})

    //raspuns pentru client 
    res.json({
        message: "Toate produsele dupa categorie",
        data: product,
        error: false,
        success: true
    })

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = getCategoryProductAll