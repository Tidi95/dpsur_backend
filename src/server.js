const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Gestion des CORS
app.use(cors({
    origin: '*', // Vous pouvez restreindre l'origine ici si nécessaire
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware pour traiter les JSON et URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration de Swagger
const swaggerOptions = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'DPSUR API',
         version: '1.0.0',
         description: 'API documentation for DPSUR Backend',
      },
      servers: [
         {
            url: `http://localhost:${process.env.PORT || 3000}`,
            description: 'Local server'
         }
      ],
   },
   apis: ['./src/routes/*.js'], // Chemin des fichiers de routes
};

// Générer la documentation Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log(`Documentation disponible sur http://localhost:${process.env.PORT || 3000}/api-docs`);

// Importer les routes utilisateurs
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes); // Ajout des routes sous le préfixe /api

// Route de test
app.get('/', (req, res) => {
   res.send('Bienvenue dans DPSUR Backend avec Node.js haha');
});

// Afficher les routes disponibles
app._router.stack.forEach((middleware) => {
   if (middleware.route) {
      console.log(`Route dispo: ${middleware.route.path}`);
   }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
