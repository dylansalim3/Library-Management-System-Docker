const Sequelize = require('sequelize');
const db = require('../database/db');

module.exports = db.sequelize.define(
    "genre",{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name:{
            type: Sequelize.STRING
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    }    
);