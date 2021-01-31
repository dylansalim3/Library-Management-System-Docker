const Sequelize = require('sequelize')
const db = require("../database/db.js")

module.exports = db.sequelize.define(
    'library_map',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        floor_name:{
          type: Sequelize.INTEGER,
        },
        name:{
            type: Sequelize.STRING,
        },
        image_url:{
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    }
);