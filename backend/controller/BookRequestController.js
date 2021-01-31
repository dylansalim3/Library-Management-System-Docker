const BookRequestRepository = require('./../repository/BookRequestRepository');
const BorrowBookRepository = require('./../repository/BorrowBookRepository');
const BookRepository = require('./../repository/BookRepository');
const UserRepository = require('./../repository/UserRepository');
const NotificationRepository = require('./../repository/NotificationRepository');
const Book = require('../models/Book');
const { EXTEND, RESERVE, ACCEPTED, REJECTED, PROCESSING, BORROWED, UNAVAILABLE, AVAILABLE } = require('./../constant/constant');
const { ADMIN } = require("../constant/constant");

exports.findAllAvailableBorrowedBooksByUserId = async (req, res) => {
    const { userId } = req.body;
    const borrowedBooks = await BorrowBookRepository.findAllBorrowBook(userId);
    const bookRequests = await BookRequestRepository.findAllProcessingExtendBookRequestByUserId(userId);
    const bookIdListInBookRequests = bookRequests.map(bookRequest => bookRequest.book_id);
    // Exclude all processing books
    const filteredBorrowedBooks = borrowedBooks.filter(borrowBook => !bookIdListInBookRequests.includes(borrowBook.book_id));
    const mappedBorrowBookResults = filteredBorrowedBooks.map(result => {
        return {
            id: result.id,
            bookId: result.book_id,
            bookimg: result.book.book_detail.bookimg,
            title: result.book.book_detail.title,
            borrowDate: result.start_date,
            dueDate: result.due_date,
            returnDate: null,
            status: BORROWED,
        };
    });
    res.json(mappedBorrowBookResults);
}

exports.findBorrowBooksByEmailAndBookId = async (req, res) => {
    const { email, bookId } = req.body;
    const user = await UserRepository.findUserByEmail(email)
    BorrowBookRepository.findAllBorrowBookByUserIdAndBookId(user.id, bookId).then(borrowBooks => {
        const mappedBorrowBookResults = borrowBooks.map(result => {
            return {
                id: result.id,
                bookId: result.book_id,
                bookimg: result.book.book_detail.bookimg,
                title: result.book.book_detail.title,
                borrowDate: result.start_date,
                dueDate: result.due_date,
                returnDate: null,
                status: BORROWED,
            };
        });
        res.json(mappedBorrowBookResults);
    })
}

exports.createExtendBookRequest = async (req, res) => {
    const { userId, borrowBookIdList, url, reason } = req.body;
    const type = EXTEND;
    const status = PROCESSING;
    try {
        const newBookRequests = [];
        for (let borrowBookId of borrowBookIdList) {
            const borrowBook = await BorrowBookRepository.findBorrowBookByPk(borrowBookId);
            const bookId = borrowBook.book_id;

            const newBookRequest = {
                user_id: userId,
                book_id: bookId,
                type,
                status,
                reason,
            }
            newBookRequests.push(newBookRequest);

        }
        BookRequestRepository.bulkCreateBookRequest(newBookRequests).then(async result => {
            const allAdminUser = await UserRepository.findAllUserByRole(ADMIN);
            const allPromises = [];
            if (allAdminUser !== undefined) {
                allAdminUser.forEach(admin => {
                    const userId = admin.id;
                    const title = "New Book Request is available";
                    const desc = "1 new book request added";
                    const thumbnailUrl = "https://img.icons8.com/plasticine/2x/resize-diagonal.png";
                    allPromises.push(NotificationRepository.createNotification({ userId, title, desc, url, enablePush: true, priority: 'HIGH', thumbnailUrl }));
                });
            }
            Promise.all(allPromises).then(values => {
                res.json({ success: true });
            });
        });

    } catch (err) {
        res.status(500).json({ err: err.toString() })
    }

}

exports.findAllExtendBookRequest = (req, res) => {
    BookRequestRepository.findAllExtendBookRequest().then(async bookRequests => {
        const pendingBookRequests = [];
        const completedBookRequests = [];
        await Promise.all(bookRequests.map(async bookRequest => {
            const borrowBooks = await BorrowBookRepository.findAllBorrowBookByUserIdAndBookId(bookRequest.user.id, bookRequest.book_id);
            const isBorrowBookExist = borrowBooks.length > 0;
            const item = {
                id: bookRequest.id,
                borrowBookId: isBorrowBookExist ? borrowBooks[0].id : null,
                bookId: bookRequest.book_id,
                bookimg: bookRequest.book.book_detail.bookimg,
                title: bookRequest.book.book_detail.title,
                requestCreatedDate: bookRequest.created,
                userId: bookRequest.user.id,
                username: bookRequest.user.first_name + bookRequest.user.last_name,
                status: bookRequest.status,
                startDate: isBorrowBookExist ? borrowBooks[0].start_date : null,
                dueDate: isBorrowBookExist ? borrowBooks[0].due_date : null,
                reason:bookRequest.reason,
                rejectReason:bookRequest.reject_reason,
            };
            if (item.status === PROCESSING) {
                pendingBookRequests.push(item);
            } else {
                completedBookRequests.push(item);
            }
        }));
        res.json({ pendingBookRequests, completedBookRequests });
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    })
}

exports.acceptExtendBookRequest = async (req, res) => {
    const { bookRequestId, newDueDate, url } = req.body;
    const status = ACCEPTED;
    const bookRequest = await BookRequestRepository.findBookRequestByPk(bookRequestId);
    try {
        BorrowBookRepository.extendDueDate(bookRequest.book_id, bookRequest.user_id, newDueDate).then(result => {
            BookRequestRepository.updateBookRequestStatus(bookRequestId, status).then(bookReqResult => {
                const userId = bookReqResult.user_id;
                const title = "Book Request have been accepted";
                const desc = "A book request have been accepted";
                const thumbnailUrl = "https://www.freeiconspng.com/thumbs/success-icon/success-icon-10.png";
                NotificationRepository.createNotification({ userId, title, desc, url, enablePush: true, priority: 'HIGH', thumbnailUrl });

                res.json({ success: true });
            });
        });

    } catch (err) {
        res.status(500).json({ err: err.toString() });
    }
}

exports.rejectExtendBookRequest = async(req, res) => {
    const { bookRequestId, rejectReason, url } = req.body;
    const status = REJECTED;
    const mybookRequest = await BookRequestRepository.findBookRequestByPk(bookRequestId);
    BookRequestRepository.updateBookRequestStatus(bookRequestId, status, rejectReason).then(async bookRequest => {
        return BookRepository.updateBookStatus(bookRequest.book_id, UNAVAILABLE).then(book => {
            var userId = mybookRequest.user_id;
            const title = "Book Request have been rejected";
            const desc = rejectReason;
            const thumbnailUrl = "https://www.pinclipart.com/picdir/middle/249-2495553_icon-failure-clipart.png";
            NotificationRepository.createNotification({ userId, title, desc, url, enablePush: true, priority: 'HIGH', thumbnailUrl });

            res.json({ success: true });
        });
    }).catch(err => {
        console.log(err.toString());
        res.status(500).json({ err: err.toString() });
    })
}

exports.createReserveBookRequest = async (req, res) => {
    let { userId, bookId, reason } = req.body;
    const url = "/reservebook";
    console.log(userId,bookId, reason);
    const selectedBook = await BookRepository.findBookById(bookId);
    if (selectedBook === null) {
        res.status(404).json({ err: "Book does not exists" });
    }
    if (selectedBook.status.toUpperCase() === UNAVAILABLE) {
        // FIND ALTERNATIVE BOOK
        const availableBooks = await BookRepository.findAllAvailableBooksByBookDetailId(selectedBook.book_detail_id);
        if (availableBooks.length === 0) {
            res.status(404).json({ err: "The book is not available" });
        } else {
            bookId = availableBooks[0].id;
            const type = RESERVE;
            const status = PROCESSING;
            const newBookRequest = {
                user_id: userId,
                book_id: bookId,
                type,
                status,
                reason: reason,
            }
            BookRequestRepository.createBookRequest(newBookRequest).then(result => {
                // make book unavailable 
                return BookRepository.updateBookStatus(bookId, UNAVAILABLE).then(book => {
                    res.json(result);
                });
            }).catch(err => {
                res.status(500).json({ err: err.toString() });
            });
        }
    }else{
        const type = RESERVE;
        const status = PROCESSING;
        const newBookRequest = {
            user_id: userId,
            book_id: bookId,
            type,
            status,
            reason: reason,
        };
        BookRequestRepository.createBookRequest(newBookRequest)
            .then((result) => {
                
            // make book unavailable
            return BookRepository.updateBookStatus(
                bookId,
                UNAVAILABLE
            ).then(async(book) => {
                res.json(result);
                            //send notifications to admins
                    const allAdminUser = await UserRepository.findAllUserByRole(ADMIN);
                    const allPromises = [];
                    if (allAdminUser !== undefined) {
                        allAdminUser.forEach(admin => {
                            const userId = admin.id;
                            const title = "New book reservation is made.";
                            const desc = "1 new book reservation added";
                            const thumbnailUrl = "https://img.icons8.com/plasticine/2x/resize-diagonal.png";
                            allPromises.push(NotificationRepository.createNotification({ userId, title, desc, url, enablePush: true, priority: 'HIGH', thumbnailUrl }));
                        });
                    }
                    Promise.all(allPromises).then(values => {
                        res.json({ success: true });
                    });
            });

            })
            .catch((err) => {
            res.status(500).json({ err: err.toString() });
            });
    }

}

exports.findPendingBookReservationByUserId = (req, res) => {
    const { userId } = req.body;
    BookRequestRepository.findAllPendingBookReservationRequestByUserId(userId).then(bookRequests => {
        const mappedResults = bookRequests.map(bookRequest => {
            console.log("REASON");
            console.log(bookRequest.reason);
            return {
                id: bookRequest.id,
                bookId: bookRequest.book_id,
                title: bookRequest.book.book_detail.title,
                bookimg: bookRequest.book.book_detail.bookimg,
                requestCreatedDate: bookRequest.created,
                userId: bookRequest.user.id,
                username: bookRequest.user.first_name + bookRequest.user.last_name,
                status: bookRequest.status,
                reason:bookRequest.reason,
            };
        })
        res.json(mappedResults);
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    })
}


exports.findCompletedBookReservationByUserId = (req, res) => {
    const { userId } = req.body;
    BookRequestRepository.findAllCompletedBookReservationRequestByUserId(userId).then(bookRequests => {
        const mappedResults = bookRequests.map(bookRequest => {
            return {
                id: bookRequest.id,
                bookId: bookRequest.book_id,
                title: bookRequest.book.book_detail.title,
                bookimg: bookRequest.book.book_detail.bookimg,
                requestCreatedDate: bookRequest.created,
                userId: bookRequest.user.id,
                username: bookRequest.user.first_name + bookRequest.user.last_name,
                status: bookRequest.status,
                reason:bookRequest.reason,
                rejectReason:bookRequest.reject_reason,
            };
        })
        res.json(mappedResults);
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    })
}

exports.findAllPendingReserveBookRequest = (req, res) => {
    BookRequestRepository.findAllPendingBookReservationRequest().then(bookRequests => {
        const mappedResults = bookRequests.map(bookRequest => {
            return {
                id: bookRequest.id,
                bookId: bookRequest.book_id,
                title: bookRequest.book.book_detail.title,
                bookimg: bookRequest.book.book_detail.bookimg,
                requestCreatedDate: bookRequest.created,
                userId: bookRequest.user.id,
                username: bookRequest.user.first_name + bookRequest.user.last_name,
                status: bookRequest.status,
                requestReason:bookRequest.reason
            };
        })
        res.json(mappedResults);
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    })
}

exports.findAllCompletedReserveBookRequest = (req, res) => {
    BookRequestRepository.findAllCompletedBookReservationRequest().then(bookRequests => {
        const mappedResults = bookRequests.map(bookRequest => {
            return {
                id: bookRequest.id,
                bookId: bookRequest.book_id,
                title: bookRequest.book.book_detail.title,
                bookimg: bookRequest.book.book_detail.bookimg,
                requestCreatedDate: bookRequest.created,
                userId: bookRequest.user.id,
                username: bookRequest.user.first_name + bookRequest.user.last_name,
                status: bookRequest.status,
                rejectReason: bookRequest.reject_reason
            };
        })
        res.json(mappedResults);
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    })
}

exports.acceptBookReservationRequest = async (req, res) => {
    const { bookRequestId, startDate, dueDate } = req.body;
    const bookRequest = await BookRequestRepository.findBookRequestByPk(bookRequestId);
    BorrowBookRepository.createBorrowBook({ start_date: startDate, due_date: dueDate, book_id: bookRequest.book_id, user_id: bookRequest.user_id }).then(borrowBook => {
        return BookRequestRepository.updateBookRequestStatus(
          bookRequestId,
          ACCEPTED
        ).then((bookReqResult) => {
          const userId = bookRequest.user_id;
          const title = 'Book reservation request have been accepted';
          const desc = 'A book reservation request have been accepted';
          const url = '/reservation';
          const thumbnailUrl =
            'https://www.freeiconspng.com/thumbs/success-icon/success-icon-10.png';
          NotificationRepository.createNotification({
            userId,
            title,
            desc,
            url,
            enablePush: true,
            priority: 'HIGH',
            thumbnailUrl,
          });
          res.json({ success: true });
        });
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    });
}

exports.rejectBookReservationRequest = async(req, res) => {
    // set book to available
    const { bookRequestId, rejectReason} = req.body;
    const mybookRequest = await BookRequestRepository.findBookRequestByPk(bookRequestId);
    BookRequestRepository.updateBookRequestStatus(bookRequestId, REJECTED, rejectReason).then(bookRequest => {
        return BookRepository.updateBookStatus(
          bookRequest.book_id,
          AVAILABLE
        ).then((bookReqResult) => {
          const userId = mybookRequest.user_id;
          const title = 'Book reservation request have been rejected';
          const desc = rejectReason;
          const url = '/reservation';
          const thumbnailUrl =
            'https://www.pinclipart.com/picdir/middle/249-2495553_icon-failure-clipart.png';
          NotificationRepository.createNotification({
            userId,
            title,
            desc,
            url,
            enablePush: true,
            priority: 'HIGH',
            thumbnailUrl,
          });
          res.json({ success: true });
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ err: err.toString() });
    });
}

exports.removeBookRequest = (req, res) => {
    const { bookRequestId } = req.body;
    BookRequestRepository.removeBookRequest(bookRequestId).then(bookRequest => {
        return BookRepository.updateBookStatus(bookRequest.book_id, AVAILABLE).then(book => {
            res.json(result);
        });
    }).catch(err => {
        res.status(500).json({ err: err.toString() });
    });
}

