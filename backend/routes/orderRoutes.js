const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Récupérer tous les produits
router.get('/', orderController.getAllOrders);

// Créer un nouveau produit
router.post('/', orderController.createOrder);

// Récupérer un produit par ID
router.get('/:id', orderController.getOrderById);

// Mettre à jour un produit par ID
router.put('/:id', orderController.updateOrder);

// Supprimer un produit par ID
router.delete('/:id', orderController.deleteOrder);

module.exports = router;  