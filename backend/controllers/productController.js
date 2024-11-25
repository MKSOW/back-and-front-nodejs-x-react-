const Product = require('../models/productModel');

// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un produit
exports.createProduct = async (req, res) => {
    const { title, description, price } = req.body; 
    const product = new Product({ title, description, price });
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer un produit par ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un produit par ID
exports.updateProduct = async (req, res) => {
    const { title, description, price } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, { title, description, price }, { new: true });
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer un produit par ID
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Produit non trouvé" });
        res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
