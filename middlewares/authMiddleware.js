const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Récupération du token depuis l'en-tête Authorization
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(403).json({ error: 'Accès refusé, token manquant' });
        }

        // Vérification du format "Bearer TOKEN"
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
            return res.status(401).json({ error: 'Format de token invalide, utilisez le format Bearer TOKEN' });
        }

        const token = tokenParts[1];

        // Vérification du token JWT
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // Attacher l'utilisateur vérifié à l'objet de requête
        req.user = verified;

        next(); // Continuer le traitement de la requête
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré, veuillez vous re
