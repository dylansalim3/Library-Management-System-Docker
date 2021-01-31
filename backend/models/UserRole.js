const Sequelize = require('sequelize')
const db = require("../database/db.js")

module.exports = db.sequelize.define(
    'user_role',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // user_id: {
        //     type: Sequelize.INTEGER
        // },
        // role_id: {
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