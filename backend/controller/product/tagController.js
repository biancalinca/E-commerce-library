const Tag = require('../../models/tagModel');
const { uploadProductPermission } = require('../../helpers/permission');

// Endpoint pentru a obține toate etichetele
const getAllTags = async (req, res) => {
    try {
        const tags = await Tag.find({});
        
        res.status(200).json({
            success: true,
            data: tags
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Endpoint pentru a adăuga o etichetă nouă
const addTag = async (req, res) => {
    try {
        const sessionUserId = req.userId;

        // Verifică dacă utilizatorul are permisiuni de administrator
        const hasPermission = await uploadProductPermission(sessionUserId);
        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'Nu aveți permisiunea de a adăuga etichete.'
            });
        }

        const { name } = req.body;
        const existingTag = await Tag.findOne({ name });

        if (existingTag) {
            return res.status(400).json({
                success: false,
                message: 'Eticheta există deja'
            });
        }

        const newTag = new Tag({ name });
        await newTag.save();

        res.status(201).json({
            success: true,
            data: newTag
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    getAllTags,
    addTag
};
