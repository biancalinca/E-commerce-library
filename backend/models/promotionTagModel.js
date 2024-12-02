const mongoose = require('mongoose');

const promotionTagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

const PromotionTag = mongoose.model('PromotionTag', promotionTagSchema);

module.exports = PromotionTag;
