const jwt = require('jsonwebtoken');

// Middleware d'authentification
module.exports = (req, res, next) => {
   const authHeader = req.headers['authorization'];
   
   // Vérification de la présence du token dans l'en-tête Authorization
   if (!authHeader) {
      return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
   }

   const token = authHeader.split(' ')[1]; // Récupérer la partie après "Bearer"
   
   if (!token) {
      return res.status(401).json({ message: 'Token invalide ou manquant.' });
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérification du token avec la clé secrète
      req.user = decoded; // Attacher les données de l'utilisateur décodées à l'objet requête
      next(); // Passer à la route suivante
   } catch (error) {
      return res.status(403).json({ message: 'Token invalide ou expiré.' });
   }
};
