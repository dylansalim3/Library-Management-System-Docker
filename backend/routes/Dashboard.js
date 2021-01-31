const express = require('express');
const dashboards = express.Router();
const DashboardController = require('./../controller/DashboardController');

dashboards.post('/admin-dashboard',DashboardController.getAdminDashboardData);

dashboards.post('/student-dashboard',DashboardController.getStudentDashboardData);

module.exports = dashboards;