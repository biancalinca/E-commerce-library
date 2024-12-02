// const addToCartModel = require("../../models/cartProduct")

// const addToCartController = async(req, res) => {
//     try {

//         const { productId } = req.body
//         const currentUser = req.userId

//        // const isProductAvailable = await addToCartModel.findOne({productId})

//        // Verifică dacă produsul există deja în coșul de cumpărături pentru utilizatorul curent
//        const isProductAvailable = await addToCartModel.findOne({ productId, userId: currentUser })

//         if(isProductAvailable){
//             return res.json({
//                 message: "Produsul există deja în cosul de cumparaturi",
//                 data: [],
//                 error: true,
//                 success: false
//             })
//         }

//         const payload = {
//             productId : productId,
//             quantity : 1,
//             userId : currentUser,
//         }

//         const newAddToCart = await addToCartModel(payload)
//         const saveProduct = await newAddToCart.save()
        
        
//         return res.json({
//             message: "Produs adaugat in cos",
//             data: saveProduct,
//             success: true,
//             error: false
//         })
//     } catch (err) {
//         res.json({
//             message: err?.message || err,
//             error: true,
//             success: false
//         })
//     }

// }

// module.exports = addToCartController

const addToCartModel = require("../../models/cartProduct")

const addToCartController = async (req, res) => {
    try {
        const { productId } = req.body;
        const currentUser = req.userId;

        // Căutăm coșul utilizatorului curent
        let userCart = await addToCartModel.findOne({ userId: currentUser });

        if (!userCart) {
            // Dacă nu există un coș, creăm unul nou
            userCart = new addToCartModel({
                userId: currentUser,
                products: [{ productId, quantity: 1 }],
                totalQuantity: 1,
            });
        } else {
            // Verificăm dacă produsul există deja în coș
            const productIndex = userCart.products.findIndex(product => product.productId === productId);

            if (productIndex > -1) {
                // Dacă produsul există, mărim cantitatea
                userCart.products[productIndex].quantity += 1;
            } else {
                // Dacă produsul nu există, îl adăugăm în array
                userCart.products.push({ productId, quantity: 1 });
            }

            // Actualizăm cantitatea totală
            userCart.totalQuantity += 1;
        }
        

        // Salvăm modificările
        const savedCart = await userCart.save();

        return res.json({
            message: "Produs adăugat în coș",
            data: savedCart,
            success: true,
            error: false,
        });
    } catch (err) {
        res.json({
            message: err?.message || err,
            error: true,
            success: false,
        });
    }
};

module.exports = addToCartController;
