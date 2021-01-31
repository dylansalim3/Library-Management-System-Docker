const express = require('express');
const reports = express.Router();
const ReportController = require('./../controller/ReportController');

reports.post('/get-monthly-report',ReportController.getMonthlyReport);

module.exports = reports;