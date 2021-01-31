const express = require('express');
const backupData = express.Router();
const BackupDatabaseController = require('../controller/BackupDatabaseController');
const Mutler = require("../utils/mutler.util");

backupData.post('/backup-data', BackupDatabaseController.backupDatabase);

backupData.post('/restore-data', Mutler.uploadZipFile.single('file'), BackupDatabaseController.restoreDatabase)

backupData.post('/send-admin-backup-email', BackupDatabaseController.sendBackupEmail)

module.exports = backupData;