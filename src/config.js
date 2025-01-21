const { Sequelize } = require('sequelize');

// Vérification des variables d'environnement requises
if (!process.env.DB_URL) {
    throw new Error('La variable d\'environnement DB_URL est requise.');
}

// Connexion à la base de données
const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    logging: process.env.DB_LOGGING === 'true', // Active les logs si nécessaire via l'ENV
    define: {
        freezeTableName: true,  // Empêche Sequelize de modifier le nom des tables
        timestamps: true,       // Ajoute les champs createdAt et updatedAt
    },
    pool: {
        max: 10,    // Nombre maximum de connexions dans le pool
        min: 0,     // Nombre minimum de connexions
        acquire: 30000,  // Temps maximum avant l'abandon d'une connexion
        idle: 10000,     // Temps avant qu'une connexion inutilisée soit libérée
    }
});

// Vérification de la connexion à la base de données
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion à la base de données réussie.');
    } catch (error) {
        console.error('Erreur de connexion à la base de données :', error);
        process.exit(1); // Quitte l'application en cas d'erreur critique
    }
})();

// Exportation correcte du module
module.exports = sequelize;
