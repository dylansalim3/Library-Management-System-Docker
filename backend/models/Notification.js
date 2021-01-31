const Sequelize = require('sequelize');
const db = require('../database/db.js');

module.exports = db.sequelize.define(
    'notification',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        unread: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
        },
        title: {
            type: Sequelize.STRING,
        },
        url: {
            type: Sequelize.STRING,
        },
        thumbnail_url: {
            type: Sequelize.STRING,
        },
        priority: {
            type: Sequelize.STRING,
        },
        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
        },
        enable_push: {
            type: Sequelize.BOOLEAN
        },
        user_id: {
            type: Sequelize.INTEGER
        }
    },
    {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        // tableName: 'user'
    }
);
