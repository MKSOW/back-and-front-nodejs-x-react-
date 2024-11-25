const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authToken = require('../middlewares/authToken');
const { validateMessage } = require('../middlewares/messageValidation');

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message management API
 */

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Retrieve a list of messages
 *     description: Retrieve all messages. Requires authentication.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The message ID.
 *                   content:
 *                     type: string
 *                     description: The content of the message.
 *                   sender:
 *                     type: string
 *                     description: The sender's user ID.
 *                   receiver:
 *                     type: string
 *                     description: The receiver's user ID.
 *                   createdAt:
 *                     type: string
 *                     description: The creation timestamp of the message.
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       500:
 *         description: Server error
 */
router.get('/', authToken, messageController.getAllMessages);

/**
 * @swagger
 * /api/messages/{id}:
 *   get:
 *     summary: Retrieve a specific message by ID
 *     description: Retrieve a specific message by its ID. Requires authentication.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The message ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 content:
 *                   type: string
 *                 sender:
 *                   type: string
 *                 receiver:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authToken, messageController.getMessageById);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     description: Create a new message with content, sender, and receiver.
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - sender
 *               - receiver
 *             properties:
 *               content:
 *                 type: string
 *               sender:
 *                 type: string
 *               receiver:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', validateMessage, messageController.createMessage);

/**
 * @swagger
 * /api/messages/{id}:
 *   put:
 *     summary: Update an existing message
 *     description: Update an existing message. Requires authentication.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The message ID.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authToken,validateMessage, messageController.updateMessage);

/**
 * @swagger
 * /api/messages/{id}:
 *   delete:
 *     summary: Delete a message
 *     description: Delete a message by ID. Requires authentication.
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The message ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authToken, messageController.deleteMessage);


module.exports = router;
