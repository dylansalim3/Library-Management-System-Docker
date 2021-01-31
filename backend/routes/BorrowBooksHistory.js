const express = require('express');
const borrowBooksHistory = express.Router();

const BorrowBookHistoryController = require("../controller/BorrowBookHistoryController");

borrowBooksHistory.post('/return-book', BorrowBookHistoryController.returnBook);

borrowBooksHistory.post('/get-book-history',BorrowBookHistoryController.getBookHistory);

borrowBooksHistory.post('/is-book-expired',BorrowBookHistoryController.isBookExpired);

module.exports = borrowBooksHistory;    