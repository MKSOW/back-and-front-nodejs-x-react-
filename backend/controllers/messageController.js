const Message = require('../models/messageModel'); // Ajustez le chemin si nécessaire
const User = require('../models/userModel'); // Pour référence des utilisateurs (si nécessaire)

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }); // Récupérer tous les messages, triés par timestamp
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getMessageById = async (req, res) => {
  const userId = req.params.id;
  try {
    // Récupérer les messages envoyés ou reçus par un utilisateur spécifique
    const messages = await Message.find({
      $or: [{ senderId: userId }, { recipientId: userId }],
    }).sort({ timestamp: 1 });

    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: 'No messages found for this user' });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.createMessage = async (req, res) => {
  try {
    const { content, senderId, recipientId } = req.body;

    // Vérifiez si l'expéditeur (sender) existe
    const sender = await User.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }

    // Vérifiez si le destinataire (recipient) existe
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // Création du message
    const newMessage = {
      content,
      senderId,
      recipientId,
      createdAt: new Date()
    };

    res.status(201).json({
      success: true,
      message: "Message créé avec succès",
      data: newMessage // Remplacez par `savedMessage` si vous sauvegardez dans la base
    });
  } catch (error) {
    console.log("Erreur lors de la création du message:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }

};

exports.deleteMessage = async (req, res) => {
  const messageId = req.params.id;
  try {
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({
      message: 'Message deleted successfully',
      message: deletedMessage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateMessage = async (req, res) => {
  const messageId = req.params.id;
  const { text, recipientId, messageType } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (text) message.text = text;
    if (recipientId) message.recipientId = recipientId;
    if (messageType) message.messageType = messageType;

    const updatedMessage = await message.save();
    res.status(200).json({
      message: 'Message updated successfully',
      message: updatedMessage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
