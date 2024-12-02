const orderModel = require("../../models/orderModel")

const orderController = async(req, res) => {
    try{    

        const currentId = req.userId

        const orderList = await orderModel.find({userId : currentId})


        res.json({
            message: "Lista cu comenzi",
            data: orderList,
            error: false,
            success: true
        })

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = orderController