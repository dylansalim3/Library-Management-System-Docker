var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var port = 5000;
const fs = require('fs');
const cron = require('node-cron');
const ImageDataURI = require('image-data-uri');

app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
}));
app.use(bodyParser.urlencoded({extended: false}));


if (process.env.NODE_ENV !== 'production') {
    const dotenv = require('dotenv');
    dotenv.config();
}


var multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const ebookStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/ebooks');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        //rejects storing a file
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

const ebookUpload = multer({
    storage: ebookStorage
})

const Users = require('./routes/Users');
const Books = require('./routes/Books');
const BookDetails = require('./routes/BookDetails');
const borrowBooks = require('./routes/BorrowBooks');
const BorrowBooksHistory = require('./routes/BorrowBooksHistory');
const Genres = require('./routes/Genres');
const Roles = require('./routes/Roles');
const LibraryMaps = require('./routes/LibraryMaps');
const BackupDatabase = require('./routes/BackupDatabase');
const Subscriptions = require('./routes/Subscriptions');
const Notifications = require('./routes/Notifications');
const Reports = require('./routes/Reports');
const Dashboard = require('./routes/Dashboard');
const BookRequests = require('./routes/BookRequests');
const Author = require('./routes/Author');
const BookCategory = require('./routes/BookCategory');
const Setting = require('./routes/Setting')

app.use('/uploads', express.static('uploads'));
app.use('/migrations', express.static('migrations'));
app.use('/report', express.static('report'));
app.use('/registration_form', express.static('registration_form'));
app.use('/users', Users);
app.use('/books', Books);
app.use('/book-details', BookDetails);
app.use('/borrow-books', borrowBooks);
app.use('/borrow-books-history', BorrowBooksHistory);
app.use('/genres', Genres);
app.use('/roles', Roles);
app.use('/library-maps', LibraryMaps);
app.use('/backup-database', BackupDatabase);
app.use('/subscription', Subscriptions);
app.use('/notification', Notifications);
app.use('/report', Reports);
app.use('/dashboard', Dashboard);
app.use('/book-request', BookRequests);
app.use('/author', Author);
app.use('/bookCategory', BookCategory);
app.use('/setting', Setting);


app.post('/file', upload.single('file'), function (req, res, next) {
    const filepath = req.file.path;
    res.send(filepath);
});

app.post('/file-ebook', ebookUpload.single('file'), function (req, res, next) {
    const filepath = req.file.path;
    res.send(filepath);
});

app.post('/file-barcode', function (req, res) {
//   console.log(req.body.img);
  imgData = req.body.img;
  id = req.body.id;
  let filePath = './uploads/barcode/'+id+'.png';
  let returnPath = 'uploads/barcode/'+id+'.png';
  ImageDataURI.outputFile(imgData, filePath)
    .then((res) =>
        console.log("barcode saved to "+res)
    )
    .catch(e=>{
      console.log(e);
    });
    res.send(returnPath);
});


const borrowBook = require('./models/BorrowBook');
const borrowBookHistory = require('./models/BorrowBookHistory');
const book = require('./models/Book');
const bookDetail = require('./models/BookDetail');
const user = require('./models/User');
const genre = require('./models/Genre');
const bookAuthor = require('./models/BookAuthor');
const author = require('./models/Author');
const role = require('./models/Role');
const userRole = require('./models/UserRole');
const category = require('./models/Category');
const notification = require('./models/Notification');
const bookRequest = require('./models/BookRequest');
const setting = require('./models/Setting');
const db = require('./database/db');

book.belongsTo(bookDetail, {foriegnKey: 'book_detail_id', constraint: true, OnDelete: 'CASCADE'});
bookDetail.hasMany(book, {foriegnKey: 'book_detail_id'});

borrowBook.belongsTo(book, {foreignKey: 'book_id', constraint: true, OnDelete: 'CASCADE'});
book.hasMany(borrowBook, {foreignKey: 'book_id'});

borrowBook.belongsTo(user, {foreignKey: 'user_id',});
user.hasMany(borrowBook, {foreignKey: 'user_id',});

borrowBookHistory.belongsTo(book, {foreignKey: 'book_id'});
book.hasMany(borrowBookHistory, {foreignKey: 'book_id'});

borrowBookHistory.belongsTo(user, {foreignKey: 'user_id'});
user.hasMany(borrowBookHistory, {foreignKey: 'user_id'});

bookDetail.belongsTo(genre, {foreignKey: 'genre_id'});
genre.hasOne(bookDetail, {foreignKey: 'genre_id'});

bookDetail.belongsToMany(author, {through: "book_author", foreignKey: 'book_detail_id'});
author.belongsToMany(bookDetail, {through: "book_author", foreign_key: 'author_id'});

user.belongsToMany(role, {through: "user_role", foreignKey: 'user_id'});
role.belongsToMany(user, {through: "user_role", foreignKey: 'role_id'});

bookDetail.belongsTo(category, { foreignKey: 'category_id' });
category.hasOne(bookDetail, { foreignKey: 'category_id' });
// bookDetail.hasOne(category);
// category.belongsTo(bookDetail);

notification.belongsTo(user, {foreignKey: 'user_id',});
user.hasMany(notification, {foreignKey: 'user_id',});

bookRequest.belongsTo(user, {foreignKey: 'user_id'});
user.hasMany(bookRequest, {foreignKey: 'user_id'});

bookRequest.belongsTo(book, {foreignKey: 'book_id'});
book.hasOne(bookRequest, {foreignKey: 'book_id'})

db.sequelize.sync({logging: false});

process.on('uncaughtException', (error) => {
    console.log(error);
});

const server = app.listen(port, () => {
    console.log("Server is running on part: " + port)
});

const {startSocketServer} = require('./utils/socket.util');
startSocketServer(server);

const backupDatabaseService = require('./services/BackupDatabaseService');

//cron job executed at 08:05am on day-of-month 15., backup database
cron.schedule('5 8 15 * *', () => {
    console.log("triggered");
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    backupDatabaseService.sendBackupDatabaseEmail(currentDay, month, year);
});

