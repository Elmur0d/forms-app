const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://user:pass@localhost:5432/forms');

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Template = sequelize.define('Template', {
  title: DataTypes.STRING,
  isPublic: { type: DataTypes.BOOLEAN, defaultValue: true }
});