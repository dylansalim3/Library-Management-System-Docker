const Sequelize = require('sequelize');
const db = require('../database/db');

module.exports = db.sequelize.define(
    'borrow_book',{
        id:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,        
        },
        book_id:{
            type: Sequelize.INTEGER       
        },
        start_date:{
            type:Sequelize.DATE
        },
        due_date:{
            type: Sequelize.DATE
        },
        user_id:{
            type: Sequelize.INTEGER
        },
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    }
);

