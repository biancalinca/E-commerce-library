const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");
const userModel = require("../../models/userModel");

const statisticsAdmin = async (req, res) => {
  try {
    // Verifică dacă utilizatorul este admin
    const userId = req.userId; 
    const user = await userModel.findById(userId);

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Nu aveți permisiunea necesară pentru a accesa aceste statistici.",
        success: false
      });
    }

    // Recuperăm toate comenzile
    const allOrders = await orderModel.find().sort({ createdAt: -1 });

    // Inițializăm structuri pentru statistici
    const productSales = {};
    const categorySales = {};
    const ordersByDate = {};
    let totalUsersWithOrders = new Set();

    // Iterăm prin fiecare comandă pentru a calcula statisticile
    allOrders.forEach(order => {
      // Calculăm top produse vândute
      order.productDetails.forEach(productDetail => {
        // Calculăm produsele vândute
        if (!productSales[productDetail.productId]) {
          productSales[productDetail.productId] = { quantitySold: 0, name: '', sellingPrice: 0 };
        }
        productSales[productDetail.productId].quantitySold += productDetail.quantity;

        // Salvăm ID-ul utilizatorului pentru a calcula rata de conversie
        totalUsersWithOrders.add(order.userId);
      });

      // Calculăm comenzi pe baza de timp
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (!ordersByDate[orderDate]) {
        ordersByDate[orderDate] = { totalOrders: 0, totalSales: 0 };
      }
      ordersByDate[orderDate].totalOrders += 1;
      ordersByDate[orderDate].totalSales += order.totalAmount;
    });

    // Top produse vândute (transformăm în array și sortăm)
    const topProductsArray = await Promise.all(
      Object.entries(productSales).map(async ([productId, data]) => {
        const productInfo = await productModel.findById(productId);
        if (!productInfo) return null;  // Excludem produsele necunoscute
        return { 
          name: productInfo.title, 
          quantitySold: data.quantitySold 
        };
      })
    );

    // Filtrăm produsele necunoscute și sortăm
    const filteredTopProductsArray = topProductsArray.filter(product => product !== null);
    filteredTopProductsArray.sort((a, b) => b.quantitySold - a.quantitySold);

    // Calculăm cele mai populare categorii
    for (const productId in productSales) {
      const productInfo = await productModel.findById(productId);
      if (productInfo) {
        const category = productInfo.category;
        if (!categorySales[category]) {
          categorySales[category] = { totalSales: 0 };
        }
        categorySales[category].totalSales += productSales[productId].quantitySold * productInfo.sellingPrice;
      }
    }

    // Transformăm categorii populare în array și sortăm
    const topCategoriesArray = Object.entries(categorySales).map(([category, data]) => {
      return { category, totalSales: data.totalSales };
    });
    topCategoriesArray.sort((a, b) => b.totalSales - a.totalSales);

    // Calculăm rata de conversie a comenzilor
    const totalUsers = await userModel.countDocuments();
    const conversionRate = totalUsers > 0 ? (totalUsersWithOrders.size / totalUsers) : 0;

    // Calculăm statusul comenzilor
    const orderStatusCount = await orderModel.aggregate([
      {
        $group: {
          _id: "$paymentDetails.payment_status",
          count: { $sum: 1 }
        }
      }
    ]);

    const orderStatusCountFormatted = {};
    orderStatusCount.forEach(status => {
      orderStatusCountFormatted[status._id] = status.count;
    });

    // Calculăm top 3 cărți din fiecare categorie
    const topBooksByCategory = {};

    for (const productId in productSales) {
      const productInfo = await productModel.findById(productId);
      if (productInfo) {  // Verificăm dacă produsul există
        const category = productInfo.category;
        if (!topBooksByCategory[category]) {
          topBooksByCategory[category] = [];
        }
        topBooksByCategory[category].push({
          name: productInfo.title,
          quantitySold: productSales[productId].quantitySold
        });
      }
    }

    // Sortăm și selectăm top 3 cărți din fiecare categorie
    Object.keys(topBooksByCategory).forEach(category => {
      topBooksByCategory[category].sort((a, b) => b.quantitySold - a.quantitySold);
      topBooksByCategory[category] = topBooksByCategory[category].slice(0, 3);  // Păstrăm doar top 3
    });

    // Structura răspunsului
    res.status(200).json({
      data: {
        topProducts: filteredTopProductsArray.slice(0, 5),  // Folosim lista filtrată
        topCategories: topCategoriesArray,
        ordersByDate: Object.entries(ordersByDate).map(([date, info]) => ({
          date,
          totalOrders: info.totalOrders,
          totalSales: info.totalSales
        })),
        conversionRate,
        orderStatusCount: orderStatusCountFormatted,
        topBooksByCategory  // Adăugăm noua statistică
      },
      success: true
    });

  } catch (err) {
    res.status(500).json({ message: err.message || err, success: false });
  }
};

module.exports = statisticsAdmin;
