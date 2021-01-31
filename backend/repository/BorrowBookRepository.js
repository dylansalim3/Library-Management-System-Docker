const BorrowBook = require("../models/BorrowBook");
const Book = require('../models/Book');
const BookDetail = require('../models/BookDetail');
const {Op, Sequelize} = require("sequelize");
const UserRepository = require("../repository/UserRepository");

exports.findBorrowBookCountByEmail = async (email) => {
    const user = await UserRepository.findUserByEmail(email)

    return BorrowBook.count({where: {user_id: user.id}});
}

exports.createBorrowBook = ({start_date: startDate, due_date: dueDate, book_id: bookId, user_id: userId}) => {
    return BorrowBook.create({start_date: startDate, due_date: dueDate, book_id: bookId, user_id: userId});
}

exports.findBorrowBookByBookId = (bookId) => {
    return BorrowBook.findOne({book_id: bookId});
}

exports.findBorrowBookByPk = (pk, options) => {
    return BorrowBook.findOne({where: {id: pk}, options});
}

exports.findAllBorrowBook = (userId) => {
    return BorrowBook.findAll({
        include: [{model: Book, require: true, include: [BookDetail]}],
        where: {user_id: userId}
    });
}

exports.findAllBorrowBookByUserIdAndBookId = (userId, bookId) => {
    const queryCriteria = {};
    if (userId) {
        queryCriteria['user_id'] = userId;
    }
    if (bookId) {
        queryCriteria['book_id'] = bookId;
    }
    return BorrowBook.findAll({include: [{model: Book, require: true, include: [BookDetail]}], where: queryCriteria});
}

exports.getBorrowBookCount = (userId) => {
    return BorrowBook.count({where: {user_id: userId}});
}

exports.getCurrentMonthBorrowedBookByUserId = (userId) => {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    return BorrowBook.count({
        where: {
            user_id: userId,
            start_date: {
                [Op.gte]: new Date(year, month, 1, 0, 0, 0, 0),
                [Op.lt]: new Date(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1, 1, 0, 0, 0, 0)
            }
        }
    });
}

exports.getOverdueBooksCount = () => {
    return BorrowBook.count({where: {due_date: {$lt: new Date()}}});
}

exports.getOverdueBooksCountByUserId = (userId) => {
    return BorrowBook.count({where: {user_id: userId, due_date: {$lt: new Date()}}});
}

exports.getBorrowedBookCountByMonth = (month, year) => {
    return BorrowBook.count({
        where: {
            start_date: {
                [Op.gte]: new Date(year, month, 1, 0, 0, 0, 0),
                [Op.lt]: new Date(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1, 1, 0, 0, 0, 0)
            }
        }
    });
}

exports.getTotalOverdueBooksCountByMonth = (month, year) => {
    return BorrowBook.count({
        where: {
            due_date: {
                [Op.gte]: new Date(year, month, 1, 0, 0, 0, 0),
                [Op.lt]: new Date(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1, 1, 0, 0, 0, 0)
            }
        }
    });
}

exports.extendDueDate = (bookId, userId, newDueDate) => {
    return BorrowBook.findOne({where: {book_id: bookId, user_id: userId}}).then(borrowBook => {
        if (!borrowBook) {
            throw Error("Borrow Book entry not found");
        }
        borrowBook.due_date = newDueDate;
        borrowBook.save();
        return borrowBook;
    });
}

exports.extendDueDateByBorrowBookId = (borrowBookId, newDueDate) => {
    return BorrowBook.findOne({where: {id: borrowBookId}}).then(borrowBook => {
        borrowBook.due_date = newDueDate;
        borrowBook.save();
        return borrowBook;
    });
}

exports.getTopFiveBooksBorrowed = () => {
    return BorrowBook.findAll({
        include: [{model: Book, require: true, include: [BookDetail]}],
        attributes: ['book_id', [Sequelize.fn('count', Sequelize.col('book_id')), 'book_count']],
        group: ['book_id'],
        order: [[Sequelize.col('book_count'), 'DESC']],
        raw: true
    }).then(books => {
        const topFiveBooks = books.slice(0, 5);
        return topFiveBooks.map(borrowBook => {
            return {
                "book_detail_id": borrowBook['book.book_detail_id'],
                "title": borrowBook['book.book_detail.title'],
                "author": borrowBook['book.book_detail.author'],
                "count": borrowBook.book_count
            }
        })
    });
}