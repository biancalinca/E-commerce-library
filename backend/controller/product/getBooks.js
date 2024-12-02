const productModel = require("../../models/productModel")
const getBooksController = async(req, res) => {
    try{    

        const allBooks = await productModel.find().sort({
            createdAt: -1
        })

        res.status(200).json({
            message: "All books",
            data: allBooks,
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

module.exports = getBooksController