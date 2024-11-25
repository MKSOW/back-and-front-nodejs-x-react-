const mongoose = require('mongoose');

const categorieSchema = new mongoose.Schema ({
    name: { type: String, required: true },
}, {timestamps: true});

module.exports = mongoose.model('categorie', categorieSchema);