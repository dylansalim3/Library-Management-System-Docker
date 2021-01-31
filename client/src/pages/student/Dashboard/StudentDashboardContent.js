import React from 'react';
import borrowBookIcon from "../../../images/borrow-book.png";
import bookStackIcon from "../../../images/book-stack.png";
import expiredBookIcon from "../../../images/expired-book.png";
import bookShelfIcon from "../../../images/book-shelf.png";
import DashboardCards from "../../../components/DashboardCards";
import axios from "axios";

import jwt_decode from "jwt-decode";


const StudentDashboardContent = () => {
    const [onLoanBookCount, setOnLoanBookCount] = React.useState(0);
    const [booksBorrowedCount, setBooksBorrowedCount] = React.useState(0);
    const [overdueBookCount, setOverdueBookCount] = React.useState(0);
    const [booksAddedCurrentMonth, setBooksAddedCurrentMonth] = React.useState(0);

    const overviewItems = [
        {title: 'No. of books currently on loan', detail: onLoanBookCount, icon: borrowBookIcon},
        {title: 'No. of books borrowed this month', detail: booksBorrowedCount, icon: bookStackIcon},
        {title: 'No. of books overdue', detail: overdueBookCount, icon: expiredBookIcon},
        {title: 'No. of books added this week', detail: booksAddedCurrentMonth, icon: bookShelfIcon}
    ];


    React.useEffect(() => {
        var token = localStorage.usertoken;
        var decoded = jwt_decode(token);
        axios.post('dashboard/student-dashboard', {userId: decoded.id}).then(result => {
            const apiResult = result.data;
            setOnLoanBookCount(apiResult.onLoanBookCount);
            setBooksBorrowedCount(apiResult.booksBorrowedCount);
            setOverdueBookCount(apiResult.overdueBookCount);
            setBooksAddedCurrentMonth(apiResult.booksAddedCurrentMonth);
        });
    }, []);

    return (
      <div>
        <h1 style={{ marginBottom: '20px' }}>Overview</h1>
        <div style={{ margin: '20px' }}>
          <DashboardCards overviewItems={overviewItems} />
        </div>
      </div>
    );
};

export default StudentDashboardContent;
