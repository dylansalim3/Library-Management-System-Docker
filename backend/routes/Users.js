const express = require('express');
const users = express.Router();
const Mutler = require("../utils/mutler.util");

const UserController = require("../controller/UserController");

users.post('/admin/get-all-profile', UserController.adminGetAllProfile);

users.post('/profile', UserController.getUserById);

users.post('/updateprofile', UserController.updateUserProfile);

users.post('/register', UserController.registerUser);

users.post('/loginwithrole', UserController.loginWithRole);

users.post('/register-user', Mutler.uploadCsvFile.single('file'), UserController.registerUserByCsv);

users.post('/complete-registration', UserController.completeRegistration);

users.get('/get-registration-csv', UserController.getRegistrationCsv);

users.post('/get-user-by-verification-hash', UserController.getUserByVerificationHash);

users.post('/delete-user-role', UserController.removeUserRole);

users.post('/add-user-role', UserController.addUserRole);

users.post('/password-recovery', UserController.sendForgetPasswordEmail);

users.post('/reset-password',UserController.resetPassword);


module.exports = users;
