const Genre = require('../models/Genre');
const db = require('../database/db.js');

exports.findAllGenre = () =>{
    return Genre.findAll();
}

exports.createGenre= (name) => {
  return Genre.create({ name: name });
};

exports.deleteGenre = (id) => {
  return db.sequelize.query(
    `DELETE FROM genre WHERE id = ${JSON.stringify(id)}`
  );
};