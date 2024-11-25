const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorieController');

// Routes pour les catégories
router.get('/', categorieController.getAllCategories);          // Récupérer toutes les catégories
router.post('/', categorieController.createCategorie);          // Créer une nouvelle catégorie
router.get('/:id', categorieController.getCategorieById);       // Récupérer une catégorie par ID
router.put('/:id', categorieController.updateCategorie);        // Mettre à jour une catégorie par ID
router.delete('/:id', categorieController.deleteCategorie);     // Supprimer une catégorie par ID

module.exports = router;
