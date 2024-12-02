const userModel = require('../../models/userModel')

async function deleteUser(req, res) {
    try {
        // ID-ul utilizatorului logat luat din sesiune
        const sessionUserId = req.userId;

        // ID-ul utilizatorului care trebuie șters, primit din parametrii rutei
        const { userId } = req.body;

        // Obțin detalii despre utilizatorul logat pentru a verifica permisiunile
        const sessionUser = await userModel.findById(sessionUserId);

        // Verific dacă utilizatorul logat este administrator sau are alt rol cu permisiuni
        if (!sessionUser || sessionUser.role !== 'ADMIN') {
            return res.status(403).json({
                message: "Nu ai permisiunea de a șterge utilizatori",
                error: true,
                success: false
            });
        }

        // Șterg utilizatorul specificat
        const deletedUser = await userModel.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                message: "Utilizatorul nu a fost găsit",
                error: true,
                success: false
            });
        }

        res.status(200).json({
            message: "Utilizatorul a fost șters cu succes",
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = deleteUser;
