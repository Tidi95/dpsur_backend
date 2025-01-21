const { Sequelize } = require('sequelize');

// Connexion à la base de data
const sequelize = new Sequelize(process.env.DB_URL, {
	dialect: 'postgres',
	logging: false, // Désactiver les logs SQL
});

module.export = sequelize;

