const express = require('express');
const roles = express.Router();
const Role = require('../models/Role');
const RoleController = require("../controller/RoleController");

roles.get('/admin/get-roles', RoleController.getAdminRoles);

roles.get('/teacher/get-roles', RoleController.getTeacherRoles);

module.exports = roles;