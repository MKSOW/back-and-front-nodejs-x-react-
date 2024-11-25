
const Conversation = require('../models/conversationModel');



// Créer une conversation
exports.createConversation = async (req, res) => {
  const { title, participants } = req.body;
  try {
    const newConversation = new Conversation({ title, participants });
    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la conversation', error });
  }
};

// Récupérer les conversations d'un utilisateur
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur connecté
    const conversations = await Conversation.find({ participants: userId });
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des conversations', error });
  }
};

