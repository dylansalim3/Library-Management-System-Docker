const express = require('express');
const bookRequests = express.Router();
const BookRequestController = require('./../controller/BookRequestController');

bookRequests.post('/find-all-borrowed-books', BookRequestController.findAllAvailableBorrowedBooksByUserId);

bookRequests.post('/add-extend-book-request', BookRequestController.createExtendBookRequest);

bookRequests.post('/find-all-extend-book-requests', BookRequestController.findAllExtendBookRequest);

bookRequests.post('/find-all-borrowed-books-by-email-bookid',BookRequestController.findBorrowBooksByEmailAndBookId);

bookRequests.post('/accept-extend-book-request', BookRequestController.acceptExtendBookRequest);

bookRequests.post('/reject-extend-book-request', BookRequestController.rejectExtendBookRequest);

bookRequests.post('/add-reserve-book-request',BookRequestController.createReserveBookRequest);

bookRequests.post('/find-book-reservation-by-user-id',BookRequestController.findPendingBookReservationByUserId);

bookRequests.post('/find-completed-book-reservation-by-user-id',BookRequestController.findCompletedBookReservationByUserId)

bookRequests.post('/find-all-pending-book-reservations',BookRequestController.findAllPendingReserveBookRequest);

bookRequests.post('/find-all-completed-book-reservations',BookRequestController.findAllCompletedReserveBookRequest);

bookRequests.post('/accept-book-reservation-request',BookRequestController.acceptBookReservationRequest);

bookRequests.post('/reject-book-reservation-request',BookRequestController.rejectBookReservationRequest);

bookRequests.post('/remove-book-request', BookRequestController.removeBookRequest);

module.exports = bookRequests;