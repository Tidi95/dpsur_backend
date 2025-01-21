const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { User } = require('../models');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     responses:
 *       200:
 *         description: Succès
 */

// Récupérer le profil de l'utilisateur connecté
router.get('/profile', authMiddleware, async (req, res) => {
   try {
      const user = await User.findByPk(req.user.id, {
         attributes: { exclude: ['password'] }  // Ne pas retourner le mot de passe
      });

      if (!user) {
         return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      res.status(200).json(user);
   } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
   }
});

// Récupérer tous les utilisateurs
router.get('/users', async (req, res) => {
   try {
      const users = await User.findAll({
         attributes: { exclude: ['password'] }  // Exclure les mots de passe dans la réponse
      });

      res.status(200).json(users);
   } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
   }
});

// Inscription d'un nouvel utilisateur
router.post('/signup', async (req, res) => {
   try {
      const { phone, password, balance } = req.body;

      if (!phone || !password) {
         return res.status(400).json({ error: "Tous les champs sont requis" });
      }

      const existingUser = await User.findOne({ where: { phone } });
      if (existingUser) {
         return res.status(400).json({ error: "Ce numéro de téléphone est déjà utilisé" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
         phone: phone,
         password: hashedPassword,
         balance: balance || 0.00
      });

      res.status(201).json({ message: "Utilisateur créé avec succès", user });
   } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
   }
});

// Connexion d'un utilisateur
router.post('/login', async (req, res) => {
   try {
      const { phone, password } = req.body;

      if (!phone || !password) {
         return res.status(400).json({ error: "Tous les champs sont requis" });
      }

      const user = await User.findOne({ where: { phone } });

      if (!user) {
         return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
         return res.status(401).json({ error: "Mot de passe incorrect" });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: "Connexion réussie", token });
   } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
   }
});

module.exports = router;
