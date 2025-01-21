'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Méthode helper pour définir les associations.
     * Cette méthode n'est pas une partie du cycle de vie de Sequelize.
     * Le fichier `models/index.js` appellera cette méthode automatiquement.
     */
    static associate(models) {
      // Définir les relations ici si nécessaire, par exemple:
      // User.hasMany(models.Order, { foreignKey: 'userId' });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Le nom ne peut pas être vide' },
          len: { args: [3, 50], msg: 'Le nom doit contenir entre 3 et 50 caractères' },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Cet email est déjà utilisé' },
        validate: {
          isEmail: { msg: 'Veuillez fournir une adresse email valide' },
          notEmpty: { msg: 'L\'email est requis' },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: 'Ce numéro de téléphone est déjà enregistré' },
        validate: {
          isNumeric: { msg: 'Le numéro de téléphone ne doit contenir que des chiffres' },
          len: { args: [10, 15], msg: 'Le téléphone doit contenir entre 10 et 15 chiffres' },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Le mot de passe est requis' },
          len: { args: [6, 100], msg: 'Le mot de passe doit contenir au moins 6 caractères' },
        },
      },
      balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
        validate: {
          isDecimal: { msg: 'Le solde doit être un nombre décimal valide' },
          min: { args: [0], msg: 'Le solde ne peut pas être négatif' },
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true, // Ajoute automatiquement `createdAt` et `updatedAt`
      hooks: {
        beforeCreate: async (user) => {
          const bcrypt = require('bcryptjs');
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        },
      },
      defaultScope: {
        attributes: { exclude: ['password'] }, // Exclure le champ mot de passe lors des requêtes par défaut
      },
      scopes: {
        withPassword: { attributes: {} }, // Ajouter le champ mot de passe si nécessaire
      },
    }
  );

  return User;
};
