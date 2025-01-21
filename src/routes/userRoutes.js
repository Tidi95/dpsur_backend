
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

const express = require('express');
const router = express.Router();
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

router.get('/profile', authMiddleware, async (req, res) => {
   const user = await User.findByPk(req.user.id);
   res.status(200).json(user);
});

router.get('/users', async (req,res) => {
   try {
      const users = await User.findAll();
      res.status(200).json(users);
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

// Inscrire un nouvel user
router.post('/signup', async (req, res) => {
   try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
         phone: req.body.phone,
         password: hashedPassword,
         balance: req.body.balance | 0.00
      });
      res.status(201).json({message: "Utilisateur créé avec succès", user });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

// connexion d'un utilisateur
router.post('/login', async (req, res) => {
   try {
      const users = await User.findAll({ where: { phone: req.body.phone } });
      if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(401).json({ error: "Mot de passe incorrect" });

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: "Connexion réussie", token });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

module.exports = router;
