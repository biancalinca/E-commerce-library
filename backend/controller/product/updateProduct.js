const { uploadProductPermission } = require("../../helpers/permission")

const productModel = require("../../models/productModel")

async function updateProductController(req, res) {
    try{

        const sessionUserId = req.userId

        if(!uploadProductPermission(sessionUserId)){
            throw new Error('Nu aveti permisiunile necesare')
        }

        const {_id, ...resBody} = req.body

        const updateProduct = await productModel.findByIdAndUpdate(_id, resBody)

        res.status(201).json({
            message: "Carte modificata cu succes",
            data: updateProduct,
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

module.exports = updateProductController