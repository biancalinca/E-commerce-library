const express = require('express')

const router = express.Router()

const userRegisterController = require('../controller/userRegister')
const userLoginController = require('../controller/userLogin')
const userDetailController = require('../controller/user/userDetail')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/updateUserRole')
const uploadProductController = require('../controller/product/uploadProduct')
const getBooksController = require('../controller/product/getBooks')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProduct')
const { loginLimiter } = require('../middleware/rateLimit');
const getCategoryProductAll = require('../controller/product/getCategoryProductAll')
const getProductDetails = require('../controller/product/getProductDetails')
const addToCartController = require('../controller/user/addToCartController')
const countAddToCart = require('../controller/user/countAddToCart')
const addToCartView = require('../controller/user/addToCartView')
const updateAddToCartProduct = require('../controller/user/updateAddToCartPRoduct')
const deleteAddToCartProduct = require('../controller/user/deleteAddToCartProduct')
const searchProduct = require('../controller/product/searchProduct')
const deleteUser = require('../controller/user/deteleUser')
const filterProductController = require('../controller/product/filterProduct')
const paymentController = require('../controller/order/paymentController')
const webhooks = require('../controller/order/webhook')
const orderController = require('../controller/order/orderController')
const allOrderAdmin = require('../controller/order/allOrderAdmin')
const deleteProductController = require('../controller/product/deleteProduct')
const { getPriceRangeController } = require('../controller/product/getPriceRangeController')
const editUserController = require('../controller/user/editUserProfile')
const {addReview, getReviewsByProduct, editReview, deleteReview} = require('../controller/product/reviewController')
const { getAllTags, addTag } = require('../controller/product/tagController')
const { addPromotionTag, getAllPromotionTags } = require('../controller/product/promotionTagController')
const { addToWishlistController, viewWishlistController } = require('../controller/user/wishlistController')
const countAddToWishlist = require('../controller/user/countAddToWishlist')
const deleteWishlistProduct = require('../controller/product/deleteFromWishlist')
const deleteReviewController = require('../controller/user/deleteReviewsController')
const statisticsAdmin = require('../controller/order/statisticsAdmin')
const topSellingBooks = require('../controller/product/topSellingBooks')


router.post('/login', loginLimiter, userLoginController);
router.post('/register', userRegisterController)
router.post('/login', userLoginController)
// Aplicarea limitelor pentru rutele de autentificare și înregistrare

router.get("/user-details", authToken, userDetailController)
router.get("/userLogout", userLogout)
router.post("/edit-user-profile", authToken, editUserController)

//admin panel
router.get("/all-users", authToken, allUsers)
router.post("/update-user", authToken, updateUser)
router.get("/all-order", authToken, allOrderAdmin)
router.delete("/delete-product/:id", authToken, deleteProductController)
router.get("/get-statistics", authToken, statisticsAdmin)


// Ruta pentru ștergerea unui utilizator
router.delete('/user-delete', authToken, deleteUser);

//produse
router.post("/upload-product", authToken,uploadProductController)
router.get("/get-products", getBooksController)
router.post("/update-product", authToken, updateProductController)
router.get("/get-categoryProduct", getCategoryProduct)
router.post("/get-categoryProductAll", getCategoryProductAll)
router.post("/product-details", getProductDetails)
router.get("/search-product", searchProduct)
router.post("/filter-product", filterProductController)
router.get("/get-price-range", getPriceRangeController)
router.get("/get-all-tags", getAllTags)
router.post("/add-tag", authToken, addTag)
router.get("/get-all-promotions", getAllPromotionTags)
router.post("/add-promotion-tag", authToken, addPromotionTag)
router.get('/top-selling-books', authToken, topSellingBooks);

//user add to cart 
router.post("/add-to-cart", authToken, addToCartController)
router.get("/count-add-to-cart", authToken, countAddToCart)
router.get("/view-cart", authToken, addToCartView)
router.post("/update-cart-product", authToken, updateAddToCartProduct)
router.post("/delete-cart-product", authToken, deleteAddToCartProduct)

//sistemul de recenzii
router.post("/add-review", authToken, addReview)
router.get("/reviews/:productId", getReviewsByProduct)
router.post("/edit-review", authToken, editReview)
router.delete("/delete-review", authToken, deleteReview)
// Ruta pentru ștergerea unei recenzii de către un administrator
router.delete('/delete-review/:id', authToken, deleteReviewController);

//user add to wishlist
router.post("/add-to-wishlist", authToken, addToWishlistController)
router.get("/count-add-to-wishlist", authToken, countAddToWishlist)
router.get("/view-wishlist", authToken, viewWishlistController)
router.post("/delete-wishlist-product", authToken, deleteWishlistProduct)


//payment & order
router.post('/checkout', authToken, paymentController)
router.post("/webhook", webhooks) //api/webhook
router.get("/order-list", authToken, orderController)


module.exports = router