const fs = require('fs');
const path = require('path');

exports.backupDatabase = (callback) => {
    const fileName = 'backup.sql';

    let month = new Date().getMonth();
    let year = new Date().getFullYear();

    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const output = fs.createWriteStream(path.join(path.dirname(require.main.filename || process.main.filename), 'migrations', 'backup_archive', `backup-${currentDay}${month}${year}.zip`));
    

    dumpSqlFile({ dumpToFile: path.join('migrations', fileName).toString() }).then(() => {
        const backupSqlPath = path.join(path.dirname(require.main.filename || process.main.filename), 'migrations', fileName);
        zipBackupData({ fileToArchive: backupSqlPath, archiveCallback: callback, output });
    });
}

const EmailUtil = require('./../utils/emailUtils');
const UserRepository = require('./../repository/UserRepository');

exports.sendBackupDatabaseEmail = async (day, month, year) => {
    
    this.backupDatabase((filePath) => {
        UserRepository.findAllUserByRole('admin').then(admins => {
            admins.forEach(admin => {
                const {
                    subject,
                    text
                } = EmailUtil.buildBackupDatabaseEmail(`${process.env.BACKEND_URL}migrations/backup_archive/backup-${day}${month}${year}.zip`,month, year);
                EmailUtil.sendEmail(admin.email, subject, text, null, {});
            });
            return true;
        })
    })
}

const db = require('../database/db');
const mysqldump = require('mysqldump');
const Importer = require("mysql-import");

const tableName = process.env.DB_TABLE_NAME;
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

const importer = new Importer({ host: host, port: port, user: userName, password: password, database: tableName });

const dumpSqlFile = ({ dumpToFile }) => {
    return mysqldump({
        connection: {
            host: host,
            port: port,
            user: userName,
            password: password,
            database: tableName,
        },
        dumpToFile: dumpToFile,
    })
}

const archiver = require('archiver');

const zipBackupData = ({ fileToArchive, archiveCallback, output }) => {
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    output.on('end', function () {
        console.log('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
    });

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
        console.log(err);
        throw err;
    });

    //on stream closed we can end the request
    archive.on('end', function () {
        console.log('Archive wrote %d bytes', archive.pointer());
        archiveCallback(output.path);
    });

    //pipe archive data to file
    archive.pipe(output);

    archive.append(fs.createReadStream(fileToArchive), { name: 'backup.sql' })

    //append files in the uploads directory and name it uploads in the archive
    archive.directory(path.join(path.dirname(require.main.filename || process.main.filename), 'uploads'), 'uploads', null);

    archive.finalize();
}