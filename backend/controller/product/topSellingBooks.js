const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");

const topSellingBooks = async (req, res) => {
  try {
    const allOrders = await orderModel.find().sort({ createdAt: -1 });

    const productSales = {};
    allOrders.forEach(order => {
      order.productDetails.forEach(productDetail => {
        if (!productSales[productDetail.productId]) {
          productSales[productDetail.productId] = { quantitySold: 0 };
        }
        productSales[productDetail.productId].quantitySold += productDetail.quantity;
      });
    });

    const topBooksArray = await Promise.all(
      Object.entries(productSales).map(async ([productId, data]) => {
        const productInfo = await productModel.findById(productId);
        if (!productInfo) return null;  // Excludem produsele necunoscute
        return {
          name: productInfo.title || "Titlu necunoscut",
          quantitySold: data.quantitySold,
          author: productInfo.author || "Autor necunoscut",
          category: productInfo.category || "Categorie necunoscută",
          sellingPrice: productInfo.sellingPrice || "Preț indisponibil",
          price: productInfo.price || null,
          bookImage: productInfo.bookImage || [],
          _id: productInfo._id
        };
      })
    );

    const filteredTopBooksArray = topBooksArray
      .filter(book => book !== null)
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 10);

    res.status(200).json({
      data: filteredTopBooksArray,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || err, success: false });
  }
};

module.exports = topSellingBooks;
