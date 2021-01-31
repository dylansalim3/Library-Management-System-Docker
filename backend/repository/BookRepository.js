const Book = require("../models/Book");
const {Op, Sequelize} = require("sequelize");

exports.findBookByBookDetailId = (bookDetailId) => {
    return Book.findOne({where: {book_detail_id: bookDetailId}});
}

exports.findAllAvailableBooksByBookDetailId = (bookDetailId) => {
    return Book.findAll({
        where:
            {
                [Op.and]:
                    [{book_detail_id: bookDetailId},
                        Sequelize.where(
                            Sequelize.fn('upper', Sequelize.col('status')),
                            {
                                [Op.eq]: 'AVAILABLE'
                            }
                        )
                    ]
            }
    });
}

exports.findBookById = (bookId) => {
    return Book.findOne({where: {id: bookId}});
}

exports.findBookCountById = (bookId) => {
    return Book.count({where: {id: bookId}})
}
exports.deleteBookByBookDetailId = (bookDetailId, arguments) => {
    return Book.destroy({where: {book_detail_id: bookDetailId}}, arguments);
}

exports.createBook = (bookEntry, arguments) => {
    return Book.create(bookEntry, arguments);
}

exports.getBookCreatedCountByMonth = (month, year) => {
    return Book.count({
        where: {
            created: {
                [Op.gte]: new Date(year, month, 1, 0, 0, 0, 0),
                [Op.lt]: new Date(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1, 1, 0, 0, 0, 0)
            }
        }
    });
}

exports.updateBookStatus = (bookId, status) => {
    return Book.findByPk(bookId).then(book => {
        book.status = status;
        book.save();
        return book;
    });
}