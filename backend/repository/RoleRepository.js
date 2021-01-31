const db = require('../database/db.js');
const Role = require('../models/Role');

exports.findRoleById = (id) =>{
    return Role.findOne({
        where: {
            id: id,
        },
    });
}

exports.findRoleByRoleTypes = (roleTypes) =>{
    return Role.findAll({where: {role: roleTypes}})
}

