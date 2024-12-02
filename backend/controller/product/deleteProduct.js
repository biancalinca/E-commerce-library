const { deleteProductPermission } = require("../../helpers/permission")

const productModel = require("../../models/productModel")

async function deleteProductController(req, res) {
    try {
        const sessionUserId = req.userId;

        // Verificăm dacă utilizatorul are permisiunea de a șterge produse
        if (!deleteProductPermission(sessionUserId)) {
            throw new Error('Nu aveți permisiunile necesare pentru a șterge acest produs');
        }

        // Extragem ID-ul produsului din parametrii rutei
        const productId = req.params.id;

        // Căutăm și ștergem produsul din baza de date
        const deletedProduct = await productModel.findByIdAndDelete(productId);

        // Verificăm dacă produsul a fost găsit și șters
        if (!deletedProduct) {
            throw new Error('Produsul nu a fost găsit');
        }

        console.log("Product deleted successfully: -------", deletedProduct); // Log succes

        // Răspundem cu succes
        res.status(200).json({
            message: "Produsul a fost șters cu succes",
            data: deletedProduct,
            error: false,
            success: true
        });

    } catch (err) {
        console.error("Error deleting product:", err); // Log eroare
        // În cazul unei erori, răspundem cu mesajul de eroare
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = deleteProductController;