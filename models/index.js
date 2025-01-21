'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '/../config/config.json'))[env];

const db = {};

let sequelize;

// Vérification et configuration de la connexion à la base de données
try {
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], {
      ...config,
      logging: false, // Désactiver les logs SQL pour la sécurité
    });
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
      ...config,
      logging: false, // Désactiver les logs SQL
    });
  }

  console.log(`Connexion à la base de données ${config.database} réussie`);
} catch (error) {
  console.error(`Erreur de connexion à la base de données : ${error.message}`);
}

// Lecture des modèles dans le répertoire actuel
fs.readdirSync(__dirname)
  .filter((file) =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    !file.includes('.test.js')
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Gestion des associations entre les modèles
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Ajout des instances Sequelize et connexion dans l'objet `db`
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
