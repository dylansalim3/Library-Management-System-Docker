const express = require('express');
const setting = express.Router();

const SettingController = require('../controller/SettingController');

setting.post('/update', SettingController.updateSetting);
setting.get('/retrieve', SettingController.getSetting);

module.exports = setting;
