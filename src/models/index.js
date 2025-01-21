const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
   host: process.env.DB_HOST,
   dialect: process.env.DB_DIALECT,
   logging: false // Désactiver les logs pour eviter les fuites d'info sensible
});

const User = sequelize.define('User', {
   phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
         len: [10, 15], // Limit de long
         isNumeric: true // test chiffre
      }
   },
   password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
         len: [6, 50] // long min
      }
   },
   balance: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
         isDecimal: true // test Decimale
      }
   },
});

module.exports = { User, sequelize };
