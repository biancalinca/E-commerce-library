// controllers/review/deleteReviewController.js

const { deleteProductPermission } = require("../../helpers/permission");
const reviewModel = require("../../models/reviewModel");

async function deleteReviewController(req, res) {
    try {
        const sessionUserId = req.userId;

        // Verificăm dacă utilizatorul are permisiunea de a șterge recenzii
        if (!deleteProductPermission(sessionUserId)) {
            throw new Error('Nu aveți permisiunile necesare pentru a șterge această recenzie');
        }

        // Extragem ID-ul recenziei din parametrii rutei
        const reviewId = req.params.id;

        // Căutăm și ștergem recenzia din baza de date
        const deletedReview = await reviewModel.findOneAndDelete({ 'reviews._id': reviewId });

        // Verificăm dacă recenzia a fost găsită și ștersă
        if (!deletedReview) {
            throw new Error('Recenzia nu a fost găsită');
        }

        console.log("Review deleted successfully: -------", deletedReview); // Log succes

        // Răspundem cu succes
        res.status(200).json({
            message: "Recenzia a fost ștearsă cu succes",
            data: deletedReview,
            error: false,
            success: true
        });

    } catch (err) {
        console.error("Error deleting review:", err); // Log eroare
        // În cazul unei erori, răspundem cu mesajul de eroare
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = deleteReviewController;
