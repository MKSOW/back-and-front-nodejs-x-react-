const Joi = require('joi');

// Schéma de validation pour un message
const messageSchema = Joi.object({
  content: Joi.string().min(1).max(500).required().messages({
    'string.base': 'Le contenu du message doit être une chaîne de caractères.',
    'string.empty': 'Le contenu du message ne peut pas être vide.',
    'string.min': 'Le contenu du message doit comporter au moins {#limit} caractères.',
    'string.max': 'Le contenu du message ne peut pas dépasser {#limit} caractères.',
    'any.required': 'Le contenu du message est obligatoire.',
  }),
  sender: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.base': 'L\'ID de l\'expéditeur doit être une chaîne de caractères.',
    'string.pattern.base': 'L\'ID de l\'expéditeur doit être un ID valide (format MongoDB).',
    'any.required': 'L\'expéditeur est obligatoire.',
  }),
  receiver: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.base': 'L\'ID du destinataire doit être une chaîne de caractères.',
    'string.pattern.base': 'L\'ID du destinataire doit être un ID valide (format MongoDB).',
    'any.required': 'Le destinataire est obligatoire.',
  }),
});

// Middleware de validation pour la création et mise à jour des messages
const validateMessage = (req, res, next) => {
  const { error } = messageSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
    });
  }
  next();
};

module.exports = {
  validateMessage,
};
