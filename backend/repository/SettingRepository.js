const Setting = require('../models/Setting');
// const { Op, Sequelize } = require('sequelize');
const db = require('../database/db.js');

exports.updateSetting = (
    school_name,
    school_address,
    opening_hours,
    email,
    book_fine,
    reservation_function
) => {
    return db.sequelize.query(
        `UPDATE settings SET school_name = ${JSON.stringify(school_name)}
          ,school_address = ${JSON.stringify(school_address)}
          ,opening_hours = ${JSON.stringify(opening_hours)}
          ,email = ${JSON.stringify(email)}
          ,book_fine = ${JSON.stringify(book_fine)}
          ,reservation_function = ${JSON.stringify(reservation_function)}
          WHERE settings.id =1
          `
    );
};

exports.getSetting = () => {
    return db.sequelize.query(`SELECT * FROM settings WHERE settings.id =1`);
}

exports.getFineRate = () => {
    return db.sequelize.query(`SELECT book_fine FROM settings WHERE settings.id =1`);
}
