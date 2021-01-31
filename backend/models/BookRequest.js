const Sequelize = require('sequelize')
const db = require("../database/db.js")

module.exports = db.sequelize.define(
    'book_request',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.INTEGER,
        },
        book_id: {
            type: Sequelize.INTEGER,
        },
        type: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.STRING,
            require: true,
        },
        reason: {
            type: Sequelize.STRING,
        },
        reject_reason: {
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
    }
);