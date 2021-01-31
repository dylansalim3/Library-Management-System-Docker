const express = require('express');
const author = express.Router();

const AuthorController = require('../controller/AuthorController');

author.post('/add', AuthorController.addAuthor);
author.get('/get-all-authors', AuthorController.getAllAuthor);

module.exports = author;
