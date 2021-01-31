const BorrowBookRepository = require('./../repository/BorrowBookRepository');
const ReportChartService = require('./../services/ReportChartService');
const ReportService = require('./../services/ReportService');
const fs = require('fs');
const path = require('path');

exports.getMonthlyReport = async (req, res) => {
    let { month, year } = req.body;


    if (month === undefined || month < 1 || month > 12) {
        month = new Date().getMonth();
    }
    if (year === undefined || year < 2020) {
        year = new Date().getFullYear();
    }

    let hasError = false;
    const {
        allUsersBase64,
        newUsersBase64,
        numberOfBooksBorrowedDoughnutBase64,
        overdueBooksBase64,
        addedBooksBase64,
        barChartBase64
    } = await ReportChartService.generateCharts(month, year);


    const topFiveBorrowedBooks = await BorrowBookRepository.getTopFiveBooksBorrowed();

    await ReportService.createMonthlyReport({
        allUsersBase64,
        newUsersBase64,
        numberOfBooksBorrowedDoughnutBase64,
        overdueBooksBase64,
        addedBooksBase64,
        barChartBase64,
        topFiveBorrowedBooks,
        month, year
    }).then(() => {
        console.log('done created pdf');
    });


    if (hasError) {
        res.status(500).json({ msg: "failed" });
    } else {
        res.json({ msg: "success", download: req.protocol + '://' + req.get('host') + `/report/report-${month + 1}${year}.pdf` });
    }
}