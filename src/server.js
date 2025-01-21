const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Charger les var d'env
dotenv.config();

const app = express();

// Ajouter ici la gestion des CORS
app.use(cors());

// Middleware pour traiter les JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conf Swagger
const swaggerOptions = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'DPSUR API',
         version: '1.0.0',
      },
   },
   apis: ['./src/routes/\*.js'], // Spécifie chemin de fichiers route
};

// Générrer la doc Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

console.log('Documentation disponible sur http://localhost:3000/api-docs');

// Importer les routes utilisateurs
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes); // Ajout des routes sous le préfixe /api

// test
app.get('/', (req,res) => {
   res.send('Bienvenue dans DPSUR Backend avec Node.js haha');
});

app._router.stack.forEach((r) => {
   if (r.route && r.route.path) {
      console.log('Route dispo: ${r.route.path}');
   }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
        console.log('Serveur démarré sur http://localhost:${PORT}');
});
