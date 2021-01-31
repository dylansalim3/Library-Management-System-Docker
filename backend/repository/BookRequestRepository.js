const Book = require('../models/Book');
const BookDetail = require('../models/BookDetail');
const User = require('../models/User');
const BookRequest = require('./../models/BookRequest');
const { EXTEND, RESERVE, ACCEPTED, REJECTED, PROCESSING, BORROWED, UNAVAILABLE } = require('./../constant/constant');


exports.createBookRequest = (bookRequest) => {
    return BookRequest.create(bookRequest);
}

exports.bulkCreateBookRequest = (bookRequest, options) => {
    return BookRequest.bulkCreate(bookRequest);
}

exports.findBookRequestByBookId = (bookId, options) => {
    return BookRequest.findOne({ where: { book_id: bookId }, options });
}

exports.findAllProcessingExtendBookRequestByUserId = (userId) => {
    return BookRequest.findAll({ where: { user_id: userId, type: EXTEND, status: PROCESSING } });
}

exports.findAllExtendBookRequestByUserIdAndBookId = (userId, bookId) => {
    const queryCriteria = { type: EXTEND };
    if (userId) {
        queryCriteria['user_id'] = userId;
    }
    if (bookId) {
        queryCriteria['book_id'] = bookId;
    }
    return BookRequest.findAll({ where: queryCriteria });
}

exports.findAllExtendBookRequest = () => {
    return BookRequest.findAll({
      include: [{ model: Book, include: [BookDetail] }, User],
      where: { type: EXTEND }
    });
}

exports.findBookRequestByPk = (pk) => {
    return BookRequest.findByPk(pk);
}

exports.updateBookRequestStatus = (bookRequestId, status, reasonReject) => {
    console.log(reasonReject);
    return BookRequest.findOne({ where: { id: bookRequestId } }).then(bookRequest => {
        bookRequest.status = status;
        bookRequest.reject_reason = reasonReject;
        bookRequest.save();
        return bookRequest;
    });
}

exports.findAllPendingBookReservationRequestByUserId = (userId) => {
    return BookRequest.findAll({ include: [{ model: Book, include: [BookDetail] }, User], where: { status: PROCESSING, type: RESERVE, user_id: userId } });
}

exports.findAllCompletedBookReservationRequestByUserId = (userId) => {
    return BookRequest.findAll({ include: [{ model: Book, include: [BookDetail] }, User], where: { status: [ACCEPTED, REJECTED], type: RESERVE, user_id: userId } });
}

exports.findAllPendingBookReservationRequest = () => {
    return BookRequest.findAll({ include: [{ model: Book, include: [BookDetail] }, User], where: { status: PROCESSING, type: RESERVE } });
}

exports.findAllCompletedBookReservationRequest = () => {
    return BookRequest.findAll({ include: [{ model: Book, include: [BookDetail] }, User], where: { status: [ACCEPTED, REJECTED], type: RESERVE } });
}

exports.removeBookRequest = (bookRequestId) => {
    return BookRequest.destroy({ where: { id: bookRequestId } });
}
