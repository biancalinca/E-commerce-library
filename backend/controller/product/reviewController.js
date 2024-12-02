const mongoose = require('mongoose');
const reviewModel = require('../../models/reviewModel');
const productModel = require('../../models/productModel');

const addReview = async (req, res) => {
    console.log("addReview function called");
    try {
        const { productId, rating, comment } = req.body;
        const currentUser = req.userId;

        // Găsește documentul cu recenziile utilizatorului
        let userReviews = await reviewModel.findOne({ userId: currentUser });

        // Găsește produsul căruia i se adaugă recenzia
        let product = await productModel.findById(productId);

        if (!userReviews) {
            // Dacă nu există document de recenzii pentru acest utilizator, creează unul nou
            userReviews = new reviewModel({
                userId: currentUser,
                reviews: [{ productId, rating, comment }],
            });

            product.totalReviews += 1;
            product.totalRating = rating; // Prima recenzie setează direct totalRating

        } else {
            // Verifică dacă utilizatorul are deja o recenzie pentru acest produs
            const reviewIndex = userReviews.reviews.findIndex(review => review.productId.toString() === productId);

            if (reviewIndex > -1) {
                // Dacă există deja o recenzie, actualizeaz-o
                const oldRating = userReviews.reviews[reviewIndex].rating;
                userReviews.reviews[reviewIndex].rating = rating;
                userReviews.reviews[reviewIndex].comment = comment;

                // Actualizează totalRating și calculează noua valoare totală
                product.totalRating = product.totalRating - oldRating + rating;
            } else {
                // Dacă este o recenzie nouă, adaug-o
                userReviews.reviews.push({ productId, rating, comment });

                // product.totalReviews += 1;
                product.totalRating += rating; // Adaugă rating-ul la totalRating
            }
        }

        // Verifică valorile totalRating și totalReviews înainte de calcul
        console.log("totalRating al user-ului:", product.totalRating);
        console.log("totalReviews al user-ului:", product.totalReviews);

        // Calculează media rating-urilor

        // Salvează actualizările în documentul cu recenzii și produs
        await userReviews.save();
        await product.save();

        res.status(201).json({
            message: "Review successfully added or updated!",
            data: userReviews,
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "An error occurred while adding the review.",
            error: true,
            success: false,
        });
    }
};


const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Găsește toate documentele de recenzii ale utilizatorilor care conțin recenzii pentru produsul specificat
        const userReviews = await reviewModel.find({ "reviews.productId": productId })
                                             .populate('userId', 'name lastname')
                                             .exec();

        // Extrage doar recenziile care corespund cu productId din array-ul de recenzii al fiecărui utilizator
        const flattenedReviews = userReviews.flatMap(userReview =>
            userReview.reviews
                .filter(review => review.productId.toString() === productId) // Filtrare doar pentru recenziile produsului dorit
                .map(review => ({
                    ...review._doc,
                    user: userReview.userId,
                }))
        );

        // Calculul totalRating și totalReviews pentru produsul specificat
        const totalReviews = flattenedReviews.length;
        const totalRating = flattenedReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

        console.log("---Detalii review -----------------")
        console.log("Total Reviews:", totalReviews);
        console.log("Total Rating:", totalRating);
        console.log("Average Rating:", averageRating);

        res.status(200).json({
            message: "Product reviews",
            data: flattenedReviews,
            totalReviews: totalReviews,
            totalRating: totalRating,
            averageRating: averageRating,
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: err.message || "An error occurred while fetching the reviews.",
            error: true,
            success: false,
        });
    }
};

// Funcție pentru editarea unei recenzii
const editReview = async (req, res) => {
    try {
        const { reviewId, rating, comment } = req.body;
        const currentUser = req.userId;

        // Găsește documentul de recenzii al utilizatorului
        let userReviews = await reviewModel.findOne({ userId: currentUser });
        if (!userReviews) {
            return res.status(404).json({ message: 'Recenzia nu a fost găsită.', success: false });
        }

        // Găsește recenzia de editat
        const reviewIndex = userReviews.reviews.findIndex(review => review._id.toString() === reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Recenzia nu a fost găsită.', success: false });
        }

        // Actualizează recenzia
        const oldRating = userReviews.reviews[reviewIndex].rating;
        userReviews.reviews[reviewIndex].rating = rating;
        userReviews.reviews[reviewIndex].comment = comment;

        // Actualizează totalRating-ul produsului
        let product = await productModel.findById(userReviews.reviews[reviewIndex].productId);
        product.totalRating = product.totalRating - oldRating + rating;
        await product.save();

        await userReviews.save();
        res.status(200).json({ message: 'Recenzia a fost actualizată cu succes!', success: true });

    } catch (err) {
        res.status(500).json({ message: err.message || 'A apărut o eroare la editarea recenziei.', success: false });
    }
};

// Funcție pentru ștergerea unei recenzii
const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.body;
        const currentUser = req.userId;

        // Găsește documentul de recenzii al utilizatorului
        let userReviews = await reviewModel.findOne({ userId: currentUser });
        if (!userReviews) {
            return res.status(404).json({ message: 'Recenzia nu a fost găsită.', success: false });
        }

        // Găsește recenzia de șters
        const reviewIndex = userReviews.reviews.findIndex(review => review._id.toString() === reviewId);
        if (reviewIndex === -1) {
            return res.status(404).json({ message: 'Recenzia nu a fost găsită.', success: false });
        }

        // Actualizează totalRating-ul și totalReviews-ul produsului
        const reviewToDelete = userReviews.reviews[reviewIndex];
        let product = await productModel.findById(reviewToDelete.productId);
        product.totalRating -= reviewToDelete.rating;
        product.totalReviews -= 1;
        await product.save();

        // Șterge recenzia
        userReviews.reviews.splice(reviewIndex, 1);
        await userReviews.save();

        res.status(200).json({ message: 'Recenzia a fost ștearsă cu succes!', success: true });
    } catch (err) {
        res.status(500).json({ message: err.message || 'A apărut o eroare la ștergerea recenziei.', success: false });
    }
};


module.exports = { addReview, getReviewsByProduct, editReview, deleteReview };
