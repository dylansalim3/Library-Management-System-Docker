const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
  'settings',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    school_name: {
      type: Sequelize.STRING,
    },
    school_address: {
      type: Sequelize.STRING,
    },
    opening_hours: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    book_fine: {
      type: Sequelize.DECIMAL,
    },
    reservation_function: {
      type: Sequelize.TINYINT,
    },
  },
  {
    timestamps: false,
    underscored: true,
  }
);
