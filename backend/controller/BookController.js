const db = require('../database/db.js');
const AuthorRepository = require("../repository/AuthorRepository");
const BookDetailRepository = require("../repository/BookDetailRepository");
const BookRepository = require("../repository/BookRepository");

exports.addBook = async (req, res) => {
    const today = new Date();
    const author = req.body.author;
    const status = req.body.status;
    const data = {
        isbn: req.body.isbn,
        title: req.body.title,
        datepublished: req.body.datepublished,
        publisher: req.body.publisher,
        type: req.body.type,
        e_book: req.body.ebook,
        author: req.body.author,
        category_id: req.body.category,
        // genre_id: req.body.genre,
        summary: req.body.summary,
        location: req.body.location,
        bookimg: req.body.bookimg,
        status: req.body.status,
        created: today,
    };
    if (req.body.genre) {
        data['genre_id'] = req.body.genre;
    }
    db.sequelize.transaction(t => {
        return AuthorRepository.findOrCreateAuthorByName(author, {transaction: t}).spread((author, isCreated) => {

            return BookDetailRepository.findOrCreateBookDetail(data, {transaction: t}).spread((bookDetail, isCreated) => {
                const bookDetailId = bookDetail.id;
                bookDetail.addAuthor(author);
                return BookRepository.createBook({
                    status: status,
                    book_detail_id: bookDetailId
                }, {transaction: t});
            })

        });
    }).then((book) => {
        data['author'] = author;
        data['id'] = book.id;
        res.json({bookdetail: data, status: 'book added'})
    }).catch(err => {
        res.send(err);
    });
}