const multer = require('multer');

const libraryMapStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/library_map/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname.replace(' ', '-'));
    }
})

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        //rejects storing a file
        cb(null, false);
    }
}

exports.uploadImageFile = multer({
    storage: libraryMapStorage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: imageFileFilter
});

const SQLStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './migrations/backup_archive/')
    },
    filename: function (req, file, cb) {
        cb(null, 'backup.zip');
    }
});

const SQLMimeTypes = ['application/x-sql','application/sql' ,'text/sql', 'text/x-sql', 'text/plain'];

const SQLFilter = (req, file, cb) => {
    if (SQLMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        //rejects storing a file
        cb(null, false);
    }
}

exports.uploadZipFile = multer({
    storage: SQLStorage,
    limits: {
        fileSize: 1024 * 1024 * 100
    },
    // fileFilter: SQLFilter
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    }
})

const CsvFilter = (req, file, cb) => {
    if (file.mimetype === 'application/vnd.ms-excel' || file.mimetype === 'text/csv') {
        cb(null, true);
    } else {
        //rejects storing a file
        cb(null, false);
    }
}

exports.uploadCsvFile = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: CsvFilter
});