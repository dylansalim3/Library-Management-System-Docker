const BookRepository = require("../repository/BookRepository");

const BookDetailRepository = require("../repository/BookDetailRepository");
const AuthorRepository = require("../repository/AuthorRepository");
const db = require("../database/db");
const BorrowBookHistoryRepository = require("../repository/BorrowBookHistoryRepository");

exports.getBook = (req, res) => {
    const searchCriteria = req.body.searchCriteria;
    const searchCriteriaType = req.body.searchCriteriaType;
    const genreId = req.body.genre;
    BookDetailRepository.getBookDetails(searchCriteria, searchCriteriaType, genreId).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(400).json({message: 'Error in getting the books', err: err.toString()});
    });
}

exports.getLatestBook = (req, res) => {
    BookDetailRepository.getThreeLatestBook().then(bookDetails => {
        res.json(bookDetails);
    }).catch(err => {
        res.status(400).json({message: 'Latest book cannot retrieve'});
    });
}

exports.getBookRecommendation = (req, res) => {
    const {userId} = req.body;
    try {
        BorrowBookHistoryRepository.findAllBorrowBookHistoryByUserId(userId).then(borrowBookHistories => {
            if (borrowBookHistories === undefined) {
                res.status(404).json({message: "No matching history available"})
            } else {
                const genreIdList = borrowBookHistories.map(borrowBookHistory => borrowBookHistory.book.book_detail.genre_id);

                Promise.all(genreIdList.map(async genreId => {
                    return await BookDetailRepository.getBookDetails(null, null, genreIdList);
                }))
                    .then(bookDetails => {
                        res.json(bookDetails.flat());
                    });

            }

        });
    } catch (err) {
        res.status(500).json({message: 'Unable to retrieve book recommendation'});
    }

}

//haven tested
exports.updateBookDetails = async (req, res) => {
    const bookDetailId = req.body.id;
    const authorName = req.body.author;

    const bookDetailData = {
        title: req.body.title,
        isbn: req.body.isbn,
        genre_id: req.body.genreId,
        bookimg: req.body.bookimg,
        summary: req.body.summary,
        datepublished: req.body.datepublished,
        publisher: req.body.publisher,
        location: req.body.location,
    };
    // const author = await AuthorRepository.findAuthorByName(authorName).then(author => {
    //     if (author) {
    //         return author;
    //     } else {
    //         return AuthorRepository.createAuthor(authorName).then(author => {
    //             return author;
    //         }).catch(err => {
    //             res.status(400).json({message: 'Add New Author Failed'});
    //         })
    //     }
    // });


    // if (author) {
    db.sequelize.transaction(t => {
        return BookDetailRepository.findBookDetailById(bookDetailId, {transaction: t}).then(bookDetail => {
            if (bookDetail !== undefined) {
                bookDetail.title = req.body.title;
                bookDetail.isbn = req.body.isbn;
                bookDetail.genre_id = req.body.genreId;
                bookDetail.bookimg = req.body.bookimg;
                bookDetail.summary = req.body.summary;
                bookDetail.datepublished = req.body.datepublished;
                bookDetail.publisher = req.body.publisher;
                bookDetail.location = req.body.location;
                bookDetail.author = req.body.author;
                if(req.body.ebook){
                    bookDetail.e_book = req.body.ebook;
                }
                // bookDetail.addAuthor(author);
                bookDetail.save();
            }
            return bookDetail;
            // return BookAuthor.findOne({where: {book_detail_id: bookDetailId}, transaction: t}).then(bookAuthor => {
            //     console.log(bookAuthor.author_id, authorId);
            //     if (bookAuthor && bookAuthor.author_id !== authorId) {
            //         console.log('updateeee');
            //         bookAuthor.author_id = authorId;
            //         bookAuthor.save();
            //         return res.json('Book Detail Updated Successfully');
            //     }
            //     return res.json('Book Detail Updated Successfully');
            // });
        });
    }).then(result => {
        return res.json('Book Detail Updated Successfully');
    }).catch(err => {
        console.log(err);
        res.status(400).json({message: 'Book Detail Update Failed'});
    })
    // } else {
    //     res.status(400).json({message: 'Author not found and cannot be created'});
    // }

}

exports.updateBarcodePath = (req, res) => {
    const bookId = req.body.bookId;
    const barcodePath = req.body.barcodePath;
    BookDetailRepository.updateBarcodePath(bookId, barcodePath);
}

exports.deleteBook = async (req, res) => {
    const bookDetailId = req.body.id;
    const bookId = await BookRepository.findBookByBookDetailId(bookDetailId).then(book => {
        if (book) {
            return book.id;
        }
    });
    db.sequelize.transaction(t => {
        if (bookId) {
            BorrowBookHistoryRepository.deleteBookHistoryByBookId(bookId, {transaction: t});
        }
        return BookRepository.deleteBookByBookDetailId(bookDetailId, {transaction: t}).then(books => {
            return BookDetailRepository.deleteBookDetailById(bookDetailId, {transaction: t}).then(bookDetail => {
                console.log(bookDetail);
                if (bookDetail) {
                    res.json('Book Detail Deleted Successfully')
                } else {
                    res.status(400).json({message: 'Book Detail Delete Failed'});
                }
            });
        });
    }).catch(err => {
        console.log(err);
        res.status(400).json({message: 'Book Detail Delete Failed'});
    })


}


