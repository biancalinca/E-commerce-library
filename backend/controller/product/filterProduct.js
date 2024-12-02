// const productModel = require("../../models/productModel")

// const filterProductController = async(req, res) => {
//     try{    

//         const categoryList = req?.body?.category || []
        
//         const product = await productModel.find({
//             category : {
//                 $in : categoryList
//             }
//         })


//         res.status(200).json({
//             message: "Filtreaza produsele cu succes",
//             data: product,
//             error: false,
//             success: true
//         })

//     } catch (err) {
//         res.json({
//             message: err.message || err,
//             error: true,
//             success: false
//         })
//     }
// }

// module.exports = filterProductController

const productModel = require("../../models/productModel")
const tagModel = require("../../models/tagModel")

const filterProductController = async(req, res) => {
    try {
        const categoryList = req?.body?.category || [];
        const publisherList = req?.body?.publisher || []; // Added for publisher filtering
        const editionList = req?.body?.edition || [];
        const tagList = req?.body?.tags || [];
        const promotionList = req?.body?.promotions || [];


        const minPrice = req.body.minPrice || 0;
        const maxPrice = req.body.maxPrice || Infinity;

        const filterCriteria = {};

        if (categoryList.length > 0) {
            filterCriteria.category = {
                $in: categoryList
            };
        }

        if (publisherList.length > 0) {
            filterCriteria.publisher = {
                $in: publisherList
            };
        }

        if (editionList.length > 0) {
            filterCriteria.edition = {
                $in: editionList
            };
        }

        if (tagList.length > 0) {
            filterCriteria.librarianRecommendations = {
                $in: tagList
            };
        }

        if (promotionList.length > 0) {
            filterCriteria.promotions = {
                $in: promotionList
            };
        }


        // Add price range filtering
        filterCriteria.sellingPrice = {
            $gte: minPrice,  // Greater than or equal to minPrice
            $lte: maxPrice   // Less than or equal to maxPrice
        };

        const products = await productModel.find(filterCriteria);

        res.status(200).json({
            message: "Filtreaza produsele cu succes",
            data: products,
            error: false,
            success: true
        });

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = filterProductController;
