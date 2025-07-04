require('dotenv').config();
const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
  process.env.DB_NAME,     // Название БД
  process.env.DB_USER,     // Пользователь
  process.env.DB_PASSWORD, // Пароль
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false // Отключаем логи SQL-запросов
  }
);