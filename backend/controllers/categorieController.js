const Categorie = require('../models/categorieModel'); // Assurez-vous que le chemin est correct

// Créer une nouvelle catégorie
exports.createCategorie = async (req, res) => {
    const { name } = req.body; 
    const categorie = new Categorie({
        name,
    });

    try {
        const newCategorie = await categorie.save();
        res.status(201).json(newCategorie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer toutes les catégories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Categorie.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Récupérer une catégorie par ID
exports.getCategorieById = async (req, res) => {
    try {
        const categorie = await Categorie.findById(req.params.id);
        if (!categorie) return res.status(404).json({ message: "Catégorie non trouvée" });
        res.json(categorie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une catégorie par ID
exports.updateCategorie = async (req, res) => {
    const { name } = req.body;
    try {
        const categorie = await Categorie.findByIdAndUpdate(req.params.id, { name }, { new: true });
        if (!categorie) return res.status(404).json({ message: "Catégorie non trouvée" });
        res.json(categorie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une catégorie par ID
exports.deleteCategorie = async (req, res) => {
    try {
        const categorie = await Categorie.findByIdAndDelete(req.params.id);
        if (!categorie) return res.status(404).json({ message: "Catégorie non trouvée" });
        res.json({ message: "Catégorie supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
