const orderModel = require("../../models/orderModel")
const userModel = require("../../models/userModel")

const allOrderAdmin = async(req, res) =>{
     const userId = req.userId

     const user = await userModel.findById(userId)

     if(user.role !== "ADMIN"){
        return res.status(500).json({
            message : "Not authorized"
        })
     }

     const AllOrder = await orderModel.find().sort({
        createdAt : -1})

    const totalOrders = await orderModel.countDocuments(); // Numărul total de comenzi

    return res.status(200).json({
        data : AllOrder,
        totalOrders: totalOrders, // Adăugăm numărul total de comenzi în răspuns
        success : true
    })
}

module.exports = allOrderAdmin