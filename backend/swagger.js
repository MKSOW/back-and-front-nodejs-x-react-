const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Définir la configuration Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Documentation de l\'API avec Swagger',
  },
  servers: [
    {
      url: 'http://localhost:3000', // Lien vers votre serveur local
    },
  ],
};

// Options pour Swagger JSDoc
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Chemin vers vos fichiers de routes
};

// Initialiser Swagger JSDoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
