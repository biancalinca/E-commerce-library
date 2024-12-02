const productModel = require("../../models/productModel")

const searchProduct = async(req, res) => {
    try{

       const query = req?.query?.q
       const regex = new RegExp(query, 'i', 'g')
       //caut in baza de date si limitez numarul de rezultate
       const product = await productModel.find({
           $or: [
               {title: regex},
               {author: regex},
               {category: regex},
           ]
       }).limit(10);

        res.json({
            message: "Cautare produs",
            data: product,
            error: false,
            success: true
        })

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        })
    }
}

module.exports = searchProduct