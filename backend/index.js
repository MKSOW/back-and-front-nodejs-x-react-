const express = require('express');
const app = express();
const port = 4001;
require('dotenv').config();
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const socketIo = require('socket.io');
const cors = require('cors');
const http = require('http');
app.use(express.json());
app.use(cors());


const welcomeMessages = [
  "Bienvenue dans le chat ! Amusez-vous bien 🎉",
  "Ravi de vous voir ici ! 😊",
  "Salut, profitez du chat et partagez vos idées ! 🚀",
  "Bienvenue ! N'hésitez pas à poser vos questions. 🧐",
  "Un grand bonjour à vous ! 🌟"
];

// Socket IO CONFIG
const server = http.createServer(app); 
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
})

let socketsConnected = new Set();
let users = {};


  // Ajout pour stocker le dernier timestamp d'envoi de message pour chaque socket.id
const lastMessageTimestamps = {};

io.on('connection', (socket) => {
  console.log(`New client connected : ${socket.id}`);
    // Générer un message de bienvenue personnalisé
    const currentTime = new Date().toLocaleTimeString();
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    const welcomeMessage = `${randomMessage} (Connecté à ${currentTime})`;

  // Envoyer le message de bienvenue à l'utilisateur connecté
  socket.emit('welcome', welcomeMessage);

  socketsConnected.add(socket.id);

   // Quand un nouvel utilisateur choisit un nom
   socket.on('setUsername', (username) => {
    users[socket.id] = username;
  
    // Diffuser une notification pour signaler qu'un utilisateur a rejoint
    socket.broadcast.emit(
      'notification',
      `${username || 'Un utilisateur'} a rejoint le chat.`
    );
  
    // Mettre à jour la liste des utilisateurs
    io.emit('updateUserList', users);
  });
  

  socket.on('message', (message) => {
    const now = Date.now();
    const lastTimestamp = lastMessageTimestamps[socket.id] || 0;

    if (now - lastTimestamp < 1000) { // Limite de 1 seconde
      console.log(`Message de ${socket.id} ignoré, trop fréquent.`);
      return;
    }

    // Enregistrer le timestamp de l'envoi de ce message
    lastMessageTimestamps[socket.id] = now;

    console.log("Message : ", message);
    if (message.recipientId === 'All') {
      io.emit('message', message);
    } else {
      io.to(message.recipientId).emit('privateMessage', message);
      socket.emit('privateMessage', message);
    }
  });

   // Gestion de la déconnexion
   socket.on('disconnect', () => {
    console.log(`Client disconnected : ${socket.id}`);

    const username = users[socket.id] || 'Un utilisateur';

    // Supprimer l'utilisateur de la liste
    delete users[socket.id];
    socketsConnected.delete(socket.id);

    io.emit('updateUserList', users);

    // Diffuser une notification pour signaler qu'un utilisateur a quitté
    socket.broadcast.emit(
      'notification',
      `${username} a quitté le chat.`
    );
  });


  socket.on('typing', ({ recipientId, feedback }) => {
    if (recipientId === 'All') {
      socket.broadcast.emit('typing', { recipientId, feedback });
    } else {
      socket.to(recipientId).emit('typing', { recipientId, feedback });
    }
  });
  
  socket.on('stopTyping', (recipientId) => {
    if (recipientId === 'All') {
      socket.broadcast.emit('typing', { recipientId, feedback: '' });
    } else {
      socket.to(recipientId).emit('typing', { recipientId, feedback: '' });
    }
  });
  

  io.emit('clientsTotal', socketsConnected.size);

  socket.on('disconnect', () => {
    console.log(`Client disconnected : ${socket.id}`)
    socketsConnected.delete(socket.id);
    delete users[socket.id];
    io.emit('updateUserList', users);
    io.emit('clientsTotal', socketsConnected.size);
  });

});

// ROUTES CONFIG
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// SWAGGER INIT CONFIG
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info : {
      title: 'NodeJS B3',
      version: '1.0',
      description: 'Une API de fou malade',
      contact: {
        name: 'Chris'
      },
      servers : [
        {
          url: 'http://localhost:4001'
        },
      ],
    },
  },
  apis: [
    `${__dirname}/routes.js`,
    `${__dirname}/routes/*.js`,
    `${__dirname}/models/*.js`,
    `${__dirname}/controllers/*.js`,
  ],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to the database
mongoose.connect(mongoURI, {})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log(`MongoDB connection error: ${err}`))

app.get('/', (req, res) => {
 res.send("Hello, bienvue sur le serveur"); 
})

// Server.listen a la place de app.listen
server.listen(port, () => {
  console.log("Serveur en ligne port 4001");
})