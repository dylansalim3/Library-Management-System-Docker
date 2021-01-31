const UserRepository = require("../repository/UserRepository");
const BookRepository = require("../repository/BookRepository");
const BorrowBookRepository = require("../repository/BorrowBookRepository");

exports.addBorrowBook = async (req, res) => {
    const startDate = req.body.startDate;
    const dueDate = req.body.endDate;
    const bookId = req.body.bookId;
    const email = req.body.email;
    const userExist = await UserRepository.checkUserExistByEmail(email);
    const user = await UserRepository.findUserByEmail(email);
    const isBookAvailable = await BookRepository.findBookById(bookId).then(book => {
        if (book) {

            return book.status.toUpperCase() === 'AVAILABLE';
        } else {
            return false;
        }
    });

    if (!userExist) {
        res.status(400).json({message: "User does not exist"})
    } else if (!isBookAvailable) {
        res.status(400).json({message: "Book is not available"})
    } else {
        BorrowBookRepository.findBorrowBookCountByEmail(email).then(count => {
            if (count < 3) {
                BorrowBookRepository.createBorrowBook({
                    start_date: startDate,
                    due_date: dueDate,
                    book_id: bookId,
                    user_id: user.id
                })
                    .then(borrowBook => {
                        return BookRepository.findBookById(bookId).then(book => {
                            book.status = 'UNAVAILABLE';
                            return book.save();
                        }).then(() => {
                            res.json(borrowBook);
                        })
                    });

            } else {
                res.status(400).json({message: "More than 3 books borrowed by this student"});
            }
        });
    }
}

exports.findBorrowedBooksByUserId = (req, res) => {
    const {userId} = req.body;
    BorrowBookRepository.findAllBorrowBook(userId).then(result => {
        const mappedBorrowBookResults = result.map(result => {
            return {
                id: result.id,
                bookId: result.book_id,
                bookimg: result.book.book_detail.bookimg,
                title: result.book.book_detail.title,
                borrowDate: result.start_date,
                dueDate: result.due_date,
                returnDate: null,
                status: 'BORROWED',
            };
        });
        res.json(mappedBorrowBookResults);
    }).catch(err => {
        res.status(500).json({err: err.toString()});
    });
}

exports.extendExpiryDate = (req, res) => {
    const {borrowBookId, newDueDate} = req.body;
    BorrowBookRepository.extendDueDateByBorrowBookId(borrowBookId, newDueDate).then(result => {
        res.json({success: true});
    }).catch(err => {
        res.status(500).json({err: err.toString()});
    });
}

exports.getTopFiveBooksBorrowed = (req, res) => {
    BorrowBookRepository.getTopFiveBooksBorrowed().then(result=>{
        res.json(result);
    }).catch(err => {
        res.status(500).json({err: err.toString()});
    });
}