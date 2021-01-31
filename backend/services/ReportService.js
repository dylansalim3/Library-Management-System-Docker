const {jsPDF} = require('jspdf/dist/jspdf.node')

const fs = require('fs');
const {applyPlugin} = require('jspdf-autotable');
applyPlugin(jsPDF);
const headerColor = "#203864";
const headerRibbonColor = "#8497B0";
const subheaderColor = "#dae3f3";
const monthsInString = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
};

exports.createMonthlyReport = ({
                                   allUsersBase64,
                                   newUsersBase64,
                                   numberOfBooksBorrowedDoughnutBase64,
                                   overdueBooksBase64,
                                   addedBooksBase64,
                                   barChartBase64,
                                   topFiveBorrowedBooks, month, year
                               }) => {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const mime = 'image/png';

    const dataX = 7;

    const marginWithPreviousElement = 8;

    // Top Header Section
    doc.setFillColor(headerColor);
    doc.rect(0, 0, width, height / 10, 'F');

    doc.setFillColor(headerRibbonColor);
    doc.rect(10, 0, 10, 40, 'F');


    doc.setFontSize(20);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor("#FFFFFF")
    doc.text(`LIBRARY MONTHLY REPORT (${monthsInString[month]}-${year})`, width / 2 - 65, 18);


    //User Distribution Header
    const userDistributionY = 43;
    const userIconUri = transformFileToBase64Uri('./assets/icons/users.png', mime);
    const userDistributionHeaderText = "User Distribution";
    constructSubHeader(doc, userDistributionY, userIconUri, userDistributionHeaderText);

    //User Distribution Data
    doc.text("New User", width / 6, 63);
    doc.addImage(newUsersBase64, dataX + 15, 66, 60, 60);

    doc.text("Users", 4 * (width / 6) + 7, 63);
    doc.addImage(allUsersBase64, (width / 2) + 7 + 15, 66, 60, 60);


    //Dashboard Header
    const dashboardDistributionY = 66 + 60 + marginWithPreviousElement;
    const dashboardIconUri = transformFileToBase64Uri('./assets/icons/view-boards.png', mime);
    const dashboardDistributionHeaderText = "Dashboard";
    constructSubHeader(doc, dashboardDistributionY, dashboardIconUri, dashboardDistributionHeaderText);

    // Dashboard Data
    let borrowedImageUri;
    const dashboardY = 133 + 20;

    // First item
    constructDashboardItem(doc, dataX, dashboardY, ['No. of', 'books', 'borrowed', 'borrowed'], numberOfBooksBorrowedDoughnutBase64)

    // Second item
    const secondDataX = dataX + 70;
    constructDashboardItem(doc, secondDataX, dashboardY, ['No. of', 'books', 'overdue'], overdueBooksBase64)

    // Third item
    const thirdDataX = secondDataX + 70;
    constructDashboardItem(doc, thirdDataX, dashboardY, ['No. of', 'books', 'added'], addedBooksBase64)

    // Books Borrowed Header
    const booksBorrowedDistributionY = dashboardY + 30 + marginWithPreviousElement;
    const booksBorrowedIconUri = transformFileToBase64Uri('./assets/icons/book-open.png', mime);
    const booksBorrowedDistributionHeaderText = "Books Borrowed";
    constructSubHeader(doc, booksBorrowedDistributionY, booksBorrowedIconUri, booksBorrowedDistributionHeaderText);

    // Top 5 borrowed books table
    const bodyData = topFiveBorrowedBooks.map((element, index) => [index+1, element.title, element.author, element.count]);
    doc.autoTable({
        head: [['No.', 'Title', 'Author', 'Count']],
        body:
        bodyData
        // ...
        ,
        foot: ['here'],
        startY: booksBorrowedDistributionY + 10 + marginWithPreviousElement + marginWithPreviousElement,
        tableWidth: 'wrap',
        showFoot: 'firstPage',
        styles: {cellPadding: 2, fontSize: 6}
    });

    const topBookBorrowedIconUri = transformFileToBase64Uri('./assets/icons/bookmark.png', mime);
    doc.addImage({
        imageData: topBookBorrowedIconUri,
        x: dataX + 10,
        y: doc.autoTable.previous.finalY + 6,
        width: 6,
        height: 6
    });
    doc.setFontSize(12);
    doc.text("Top 5 Books Borrowed", dataX + 20, doc.autoTable.previous.finalY + 10);

    // Separator
    doc.setFillColor("#000000");
    doc.rect(width / 2, booksBorrowedDistributionY + 10 + marginWithPreviousElement, 0.25, 80, 'F');

    // Bar chart (No of books against month)
    doc.addImage(barChartBase64, (width / 2) + 7, booksBorrowedDistributionY + 10 + marginWithPreviousElement + marginWithPreviousElement, 90, 60);

    const barChartFinalY = booksBorrowedDistributionY + 10 + marginWithPreviousElement + marginWithPreviousElement + 60;
    const bookBorrowedBarChartIconUri = transformFileToBase64Uri('./assets/icons/library.png', mime);

    doc.addImage({
        imageData: bookBorrowedBarChartIconUri,
        x: (width / 2) + 7 + 10,
        y: barChartFinalY + 3,
        width: 6,
        height: 6
    });
    doc.setFontSize(12);
    doc.text("No. of Books Borrowed Against Month", (width / 2) + 7 + 20, barChartFinalY + 7);
    return doc.save(`./report/report-${month + 1}${year}.pdf`, {returnPromise: true});
}

const constructSubHeader = (doc, userDistributionY, userIconUri, headerText) => {
    const width = doc.internal.pageSize.getWidth();

    doc.setFillColor(subheaderColor);
    doc.rect(0, userDistributionY, width, 10, 'F');


    doc.addImage({imageData: userIconUri, x: 11, y: userDistributionY + 2, width: 6, height: 6});

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(15);
    doc.setTextColor("#000000")
    doc.text(headerText, 22, userDistributionY + 7);
}

const constructDashboardItem = (doc, dataX, dashboardY, descList, imgUri) => {
    const imgSize = 30;
    const textMarginLeft = 5;

    doc.addImage(imgUri, dataX, dashboardY, imgSize, imgSize);
    doc.text(descList[0], dataX + imgSize + textMarginLeft, dashboardY + (imgSize / 3));
    doc.text(descList[1], dataX + imgSize + textMarginLeft, dashboardY + (imgSize / 3) + 6);
    doc.text(descList[2], dataX + imgSize + textMarginLeft, dashboardY + (imgSize / 3) + 12);
}

const transformFileToBase64Uri = (filePath, mime) => {
    const encoding = 'base64';
    const fileData = fs.readFileSync(filePath, "base64");
    return `data:${mime};${encoding},${fileData}`;
}
