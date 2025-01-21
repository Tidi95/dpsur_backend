const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config(); // Charger les variables d'environnement

// Configuration de la connexion à la base de données
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
   host: process.env.DB_HOST,
   dialect: process.env.DB_DIALECT || 'postgres',  // Valeur par défaut
   port: process.env.DB_PORT || 5432,  // Port par défaut pour PostgreSQL
   logging: false,  // Désactiver les logs pour éviter les fuites d'informations sensibles
   dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false, // Gestion de SSL
   },
   define: {
      freezeTableName: true,  // Empêcher Sequelize de pluraliser automatiquement les noms de tables
      timestamps: true        // Ajouter automatiquement `createdAt` et `updatedAt`
   }
});

// Modèle utilisateur
const User = sequelize.define('User', {
   phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
         len: {
            args: [10, 15],
            msg: "Le numéro de téléphone doit contenir entre 10 et 15 chiffres."
         },
         isNumeric: {
            msg: "Le numéro de téléphone doit contenir uniquement des chiffres."
         }
      }
   },
   password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         len: {
            args: [6, 50],
            msg: "Le mot de passe doit contenir entre 6 et 50 caractères."
         }
      }
   },
   balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
         isDecimal: {
            msg: "Le solde doit être un nombre décimal valide."
         },
         min: {
            args: [0],
            msg: "Le solde ne peut pas être négatif."
         }
      }
   },
}, {
   tableName: 'users',  // Nom explicite pour la table
   underscored: true,   // Utilisation du format snake_case pour les colonnes
   indexes: [
      {
         unique: true,
         fields: ['phone']
      }
   ]
});

// Synchronisation de la base de données
const initializeDB = async () => {
   try {
      await sequelize.authenticate();
      console.log('Connexion à la base de données réussie.');
      await sequelize.sync({ alter: true });  // Modifier la structure en fonction des changements
      console.log('Base de données synchronisée.');
   } catch (error) {
      console.error('Impossible de se connecter à la base de données :', error);
   }
};

initializeDB();

module.exports = { User, sequelize };
