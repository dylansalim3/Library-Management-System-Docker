const path = require("path");
const fse = require('fs-extra');
const StreamZip = require('node-stream-zip');

const db = require('../database/db');
const mysqldump = require('mysqldump');
const Importer = require("mysql-import");

const tableName = process.env.DB_TABLE_NAME;
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

const backupDatabaseService = require('../services/BackupDatabaseService');

const importer = new Importer({ host: host, port: port, user: userName, password: password, database: tableName });

exports.backupDatabase = (req, res) => {
    try {
        const currentDate = new Date();
        const currentDay = currentDate.getDay();
        let month = new Date().getMonth();
        let year = new Date().getFullYear();
        backupDatabaseService.backupDatabase(() => {
            res.json({ msg: "success", download: req.protocol + '://' + req.get('host') + `/migrations/backup_archive/backup-${currentDay}${month}${year}.zip` });
        })
    } catch (err) {
        res.status(500).json({ error: `Error occurred while migrating ${err.toString()}` });
    }
}

exports.sendBackupEmail = (req, res) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    backupDatabaseService.sendBackupDatabaseEmail(currentDay, currentMonth, currentYear).then(result => {
        res.json({ msg: "success" });
    });
}

exports.restoreDatabase = (req, res) => {
    const file = req.file;
    const zip = new StreamZip({
        file: file.path,
        storeEntries: true
    });

    const uploadedArchiveFolder = path.join(path.dirname(require.main.filename || process.main.filename), 'migrations', 'uploaded_archive', 'extracted');
    const uploadsDirectory = path.join(path.dirname(require.main.filename || process.main.filename), 'uploads');

    const backupSqlFileName = 'backup.sql';
    const initialDumpSqlFileName = 'dump.sql';

    try {

        zip.on('error', err => {
            res.status(500).json({ error: "Error in backing up database", message: err.toString() });
        });

        zip.on('ready', () => {
            zip.extract(null, uploadedArchiveFolder, err => {

                zip.close();


                if (err) {
                    console.log("error in extracting" + err);
                    res.status(500).json({ error: "Error in backing up database", message: err.toString() });
                } else {
                    fse.copySync(path.join(uploadedArchiveFolder, 'uploads'),
                        uploadsDirectory, { overwrite: true },
                        function (err) {
                            if (err) {
                                //error
                                res.status(500).json({ error: "Error in backing up database", message: err.toString() });
                            }
                        });
                    dumpSqlFile({ dumpToFile: path.join('migrations', initialDumpSqlFileName).toString() })
                        .then(async result => {
                            await db.sequelize.dropAllSchemas().catch(err => {
                                res.status(500).json({ error: "Error in dropping databases", message: err.toString() });
                            });
                            console.log("dumped");

                            importer.import(path.join(uploadedArchiveFolder, backupSqlFileName).toString()).then(() => {
                                let files_imported = importer.getImported();
                                res.json(`${files_imported.length} SQL file(s) imported.`);
                            }).catch(async err => {
                                console.log(err.toString());
                                await importer.import(path.join('migrations', initialDumpSqlFileName).toString()).then(result => {
                                    console.log("changes reverted");
                                    res.status(500).json({ error: "changes reverted" });
                                }).catch(err => {
                                    console.log(err.toString());
                                    res.status(500).json({
                                        error: "Error in restoring restore old data",
                                        message: err.toString()
                                    });
                                });
                            });
                        })
                }
            });
        });


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error in backing up database", message: err.toString() });
    }


}

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