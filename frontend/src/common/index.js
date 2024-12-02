
const backendDomain = "http://localhost:8000"

const SummaryApi = {
    register : {
        url: `${backendDomain}/api/register`,
        method: 'post'
    },
    login : {
        url: `${backendDomain}/api/login`,
        method: 'post'
    },
    current_user : {
        url : `${backendDomain}/api/user-details`,
        method : 'get'
    },
    logout : {
        url : `${backendDomain}/api/userLogout`,
        method : 'get'
    },
    editUser :{
        url : `${backendDomain}/api/edit-user-profile`,
        method : 'post'
    },
    allUser : {
        url : `${backendDomain}/api/all-users`,
        method : 'get'
    },
    updateUser : {
        url : `${backendDomain}/api/update-user`,
        method : 'post'
    },
    deleteUser : {
        url : `${backendDomain}/api/user-delete`,
        method : 'delete'
    },
    uploadProduct : {
        url : `${backendDomain}/api/upload-product`,
        method : 'post'
    },
    getBooks : {
        url : `${backendDomain}/api/get-products`,
        method : 'get'
    }, 
    updateProduct : {
        url : `${backendDomain}/api/update-product`,
        method : 'post'
    },
    deleteProduct : {
        url : `${backendDomain}/api/delete-product`,
        method : 'delete'
    },
    getCategoryProduct : {
        url : `${backendDomain}/api/get-categoryProduct`,
        method : 'get'
    },
    getCategoryProductAll : {
        url : `${backendDomain}/api/get-categoryProductAll`,
        method : 'post'
    },
    sendOtp : {
        url : `${backendDomain}/auth/send-otp`,
        method : 'post'
    },
    verifyOtp : {
        url : `${backendDomain}/auth/verify-otp`,
        method : 'post'
    },
    verifyEmail: {
        url: `${backendDomain}/auth/verify-email`,
        method: 'get'
    },
    resetPassword : {
        url : `${backendDomain}/auth/reset-password`,
        method : 'post'
    },
    productDetails : {
        url : `${backendDomain}/api/product-details`,
        method : 'post'
    },
    addToCartProduct : {
        url : `${backendDomain}/api/add-to-cart`,
        method : 'post'
    },
    countAddToCart : {
        url : `${backendDomain}/api/count-add-to-cart`,
        method : 'get'
    },
    addToCartView : {
        url : `${backendDomain}/api/view-cart`,
        method : 'get'
    },
    countAddToWishlist : {
        url : `${backendDomain}/api/count-add-to-wishlist`,
        method : 'get'
    },
    viewWishlist : {
        url : `${backendDomain}/api/view-wishlist`,
        method : 'get'
    },
    addToWishlist : {
        url : `${backendDomain}/api/add-to-wishlist`,
        method : 'post'
    },
    updateAddToCartProduct : {
        url : `${backendDomain}/api/update-cart-product`,
        method : 'post'
    },
    deleteAddToCartProduct : {
        url : `${backendDomain}/api/delete-cart-product`,
        method : 'post'
    },
    deleteWishlistProduct : {
        url : `${backendDomain}/api/delete-wishlist-product`,
        method : 'post'
    },
    searchProduct : {
        url : `${backendDomain}/api/search-product`,
        method : 'get'
    },
    filterProduct : {
        url : `${backendDomain}/api/filter-product`,
        method : 'post'
    },
    getPriceRange : {
        url : `${backendDomain}/api/get-price-range`,
        method : 'get'
    },
    payment : {
        url : `${backendDomain}/api/checkout`,
        method : 'post'
    },
    getOrder :{
        url : `${backendDomain}/api/order-list`,
        method : 'get'
    },
    allOrderAdmin : {
        url : `${backendDomain}/api/all-order`,
        method : 'get'
    },
    addReview :{
        url : `${backendDomain}/api/add-review`,
        method : 'post'
    },
    viewReview : {
        url : `${backendDomain}/api/reviews/:productId`,
        method : 'get'
    },
    editReview : {
        url : `${backendDomain}/api/edit-review`,
        method : 'post'
    },
    deleteReview : {
        url : `${backendDomain}/api/delete-review`,
        method : 'delete'
    },
    deleteReviewAdmin : {
        url : `${backendDomain}/api/delete-review/:id`,
        method : 'delete'
    },
    getAllTags : {
        url : `${backendDomain}/api/get-all-tags`,
        method : 'get'
    },
    addTag : {
        url : `${backendDomain}/api/add-tag`,
        method : 'post'
    },
    addPromotionTag : {
        url : `${backendDomain}/api/add-promotion-tag`,
        method : 'post'
    },
    getAllPromotionTags : {
        url : `${backendDomain}/api/get-all-promotions`,
        method : 'get'
    },
    statisticsAdmin : {
        url : `${backendDomain}/api/get-statistics`,
        method : 'get'
    },
    topSellingBooks : {
        url : `${backendDomain}/api/top-selling-books`,
        method : 'get'
    }
}

export default SummaryApi