const Sequelize = require('sequelize')
const db = require("../database/db.js")

module.exports = db.sequelize.define(
    'role',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
      role:{
            type: Sequelize.STRING,
      }
    },
    {
        timestamps: false,
        freezeTableName: true,
        // tableName: 'user',
        underscored: true,
    }
);