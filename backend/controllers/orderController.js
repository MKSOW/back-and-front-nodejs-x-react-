const Order = require('../models/orderModel'); 


// Récupérer toutes les commandes
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer une nouvelle commande
exports.createOrder = async (req, res) => {
    const { userId, productsIds } = req.body;
    const order = new Order({
        userId,
        productsIds,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    
    try {
        const newOrder = await order.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Récupérer une commande par ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Commande non trouvée" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour une commande par ID
exports.updateOrder = async (req, res) => {
    const { userId, productsIds } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, {
            userId,
            productsIds,
            updatedAt: new Date()
        }, { new: true });
        
        if (!order) return res.status(404).json({ message: "Commande non trouvée" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Supprimer une commande par ID
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Commande non trouvée" });
        res.json({ message: "Commande supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
