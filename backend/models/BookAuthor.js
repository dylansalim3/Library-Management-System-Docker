const Sequelize = require('sequelize')
const db = require("../database/db.js")

module.exports = db.sequelize.define(
    'book_author',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // author_id: {
        //     type: Sequelize.INTEGER
        // },
        // book_detail_id:{
        //     type: Sequelize.INTEGER
        // }
    },
    {
        timestamps: false,
        freezeTableName: true,
        // tableName: 'user',
        underscored: true,
    }
);