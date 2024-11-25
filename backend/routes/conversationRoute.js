const express = require('express');
const router = express.Router();
const { createConversation, getConversations, createMessage, getMessages } = require('../controllers/conversationController');
const authToken = require('../middlewares/authToken');

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: API pour gérer les conversations et messages
 */

// Créer une nouvelle conversation
router.post('/', authToken, createConversation);

// Récupérer toutes les conversations d'un utilisateur
router.get('/', authToken, getConversations);

// Ajouter un message à une conversation
router.post('/:conversationId/messages', authToken, createMessage);

// Récupérer tous les messages d'une conversation
router.get('/:conversationId/messages', authToken, getMessages);

module.exports = router;
