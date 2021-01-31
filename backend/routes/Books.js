const express = require('express');
const books = express.Router();

const BookController = require("../controller/BookController");

books.post('/add', BookController.addBook);

module.exports = books;