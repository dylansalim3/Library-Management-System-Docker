const BorrowBookHistory = require('../models/BorrowBookHistory');
const BorrowBook = require('../models/BorrowBook');
const Book = require('../models/Book');
const BookDetail = require('../models/BookDetail');
const {Op, Sequelize} = require("sequelize");

exports.findBookHistoryByBookId = (bookId) => {
    return BorrowBook.findOne({where: {book_id: bookId}});
}

exports.findBookHistoryCountByBookId = (bookId) => {
    return BorrowBook.count({where: {book_id: bookId}})
}

exports.createBorrowBookHistory = (newBorrowBookHistoryEntry, arguments) => {
    return BorrowBookHistory.create(newBorrowBookHistoryEntry, arguments);
}

exports.getBorrowedBookByMonth = (month, year) => {
    return BorrowBookHistory.count({
        where: {
            start_date: {
                [Op.gte]: new Date(year, month, 1, 0, 0, 0, 0),
                [Op.lt]: new Date(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1, 1, 0, 0, 0, 0)
            }
        }
    });
}

exports.getCurrentMonthBorrowedBookByUserId = (userId) => {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    return BorrowBookHistory.count({
        where: {
            user_id: userId,
            start_date: {
                [Op.gte]: new Date(year, month, 1, 0, 0, 0, 0),
                [Op.lt]: new Date(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1, 1, 0, 0, 0, 0)
            }
        }
    });
}

exports.findAllBorrowBookHistoryByUserId = (userId) => {
    return BorrowBookHistory.findAll({
        include: [{model: Book, require: true, include: [BookDetail]}],
        where: {user_id: userId}
    })
}

exports.deleteBookHistoryByBookId = (bookId, arguments) => {
    return BorrowBookHistory.destroy({where: {book_id: bookId}}, arguments)
}
