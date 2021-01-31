const Sequelize = require('sequelize');
const db = require('../database/db');

module.exports = db.sequelize.define(
    'borrow_book_history',{
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
            type: Sequelize.DATE
        },
        due_date:{
            type: Sequelize.DATE
        },
        return_date:{
            type:Sequelize.DATE
        },
        status:{
            type: Sequelize.STRING
        },
        user_id:{
            type: Sequelize.INTEGER
        },
        overdue:{
            type:Sequelize.BOOLEAN
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
    }
);

