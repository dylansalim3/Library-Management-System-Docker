const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
    'book',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        status: {
            type: Sequelize.STRING,
        },
        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        book_detail_id:{
            type:Sequelize.INTEGER
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        // tableName: 'user'
    }
);
