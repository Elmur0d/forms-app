const path = require('path');
const sequelize = require('../config/db');

const models = {};

require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, require('sequelize').DataTypes);
    models[model.name] = model;
  });

module.exports = { sequelize, ...models };