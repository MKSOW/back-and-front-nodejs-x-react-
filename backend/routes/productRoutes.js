const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Récupérer tous les produits
router.get('/', productController.getAllProducts);

// Créer un nouveau produit
router.post('/', productController.createProduct);

// Récupérer un produit par ID
router.get('/:id', productController.getProductById);

// Mettre à jour un produit par ID
router.put('/:id', productController.updateProduct);

// Supprimer un produit par ID
router.delete('/:id', productController.deleteProduct);

module.exports = router;
