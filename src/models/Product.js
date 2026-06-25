const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true }
});

// Compound indexes for extremely fast cursor pagination
productSchema.index({ created_at: -1, _id: -1 });
productSchema.index({ category: 1, created_at: -1, _id: -1 });

module.exports = mongoose.model('Product', productSchema);