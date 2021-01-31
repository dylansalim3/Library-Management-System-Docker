const Category = require('./../models/Category');
const db = require('../database/db.js');

exports.findAllCategory = () => {
  return Category.findAll();
};

exports.createCategory = (name) => {
  return Category.create({ name: name });
};

exports.deleteCategory = (id) => {
    return db.sequelize.query(
      `DELETE FROM category WHERE id = ${JSON.stringify(id)}`
    );
};

