const productModel = require("../../models/productModel");

const getPriceRangeController = async (req, res) => {
    try {
        const minPrice = await productModel.find().sort({ sellingPrice: 1 }).limit(1).select('sellingPrice').lean();
        const maxPrice = await productModel.find().sort({ sellingPrice: -1 }).limit(1).select('sellingPrice').lean();

        res.status(200).json({
            message: "Fetched price range successfully",
            data: {
                minPrice: minPrice[0]?.sellingPrice || 0,
                maxPrice: maxPrice[0]?.sellingPrice || 1000,
            },
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
};

module.exports = { getPriceRangeController };
