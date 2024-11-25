const Joi = require('joi');

// Schéma de validation pour les commandes
const orderSchema = Joi.object({
    userId: Joi.string().required().messages({
        'string.empty': 'L\'ID utilisateur est requis.',
        'any.required': 'L\'ID utilisateur est requis.'
    }),
    productsIds: Joi.array().items(Joi.string().required()).min(1).required().messages({
        'array.min': 'Au moins un ID de produit est requis.',
        'string.empty': 'Chaque ID de produit doit être une chaîne valide.',
        'any.required': 'La liste des produits est requise.'
    }),
});

// Fonction de validation pour la création de commande
const validateOrder = (orderData) => {
    return orderSchema.validate(orderData, { abortEarly: false });
};

module.exports = { validateOrder };
