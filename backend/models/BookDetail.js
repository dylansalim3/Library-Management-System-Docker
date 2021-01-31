const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
  'book_detail',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    isbn: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
    },
    author: {
      type: Sequelize.STRING,
    },
    datepublished: {
      type: Sequelize.DATE,
    },
    publisher: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    e_book: {
      type: Sequelize.STRING,
    },
    barcode_path: {
      type: Sequelize.STRING,
    },
    category_id: {
      type: Sequelize.INTEGER,
    },
    genre_id: {
      type: Sequelize.INTEGER,
    },
    location: {
      type: Sequelize.STRING,
    },
    bookimg: {
      type: Sequelize.STRING,
    },
    summary: {
      type: Sequelize.TEXT,
    },
    status: {
      type: Sequelize.STRING,
    },
    created: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    // tableName: 'user'
  }
);
