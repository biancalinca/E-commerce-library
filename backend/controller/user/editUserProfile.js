const userModel = require('../../models/userModel');

async function editUserController(req, res) {
    try {
        const userId = req.userId;
        const { name, lastname, email, phone, address } = req.body;

        // Pregătim datele de actualizat
        const payload = {
            ...(name && { name }),
            ...(lastname && { lastname }),
            ...(email && { email }),
            ...(phone && { phone }),
            ...(address && { address }),
        };

        // Găsim și actualizăm utilizatorul
        const updatedUser = await userModel.findByIdAndUpdate(userId, payload, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        res.status(200).json({
            message: "Ți-ai actualizat datele cu succes!",
            data: updatedUser,
            error: false,
            success: true,
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = editUserController;
