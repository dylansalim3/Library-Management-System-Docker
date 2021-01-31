import React, {Component} from 'react';
import StudentBoilerplate from "../StudentBoilerplate";
import axios from 'axios';
import jwt_decode from "jwt-decode";
import EnhancedTable from "../../../components/EnhancedTable";

class BorrowHistoryPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            borrowBookHistory: [],
        }
    }

    componentDidMount() {
        if (localStorage.usertoken) {
            var token = localStorage.usertoken;
            var decoded = jwt_decode(token);
            axios.post('borrow-books-history/get-book-history', {
                userId: decoded.id,
            }).then(res => {
                this.setState({
                    borrowBookHistory: res.data
                });
            }).catch(err => {
                console.log(err.toString);
            });
        }
    }

    render() {
        const borrowBookHistory = this.state.borrowBookHistory;

        const headCells = [
            {id: 'title', numeric: false, disablePadding: false, label: 'Message'},
            {id: 'bookId', numeric: false, disablePadding: false, label: 'Book ID'},
            {id: 'bookimg', numeric: false, type: 'img', disablePadding: false, label: 'Book Cover'},
            {id: 'borrowDate', numeric: false, type: 'date', disablePadding: false, label: 'Borrow Date'},
            {id: 'dueDate', numeric: false, type: 'date', disablePadding: false, label: 'Due Date'},
            {id: 'returnDate', numeric: false, type: 'date', disablePadding: false, label: 'Return Date'},
            {id: 'status', numeric: false, disablePadding: false, label: 'Status'},
        ];
        return (
            <div>
                <StudentBoilerplate page={'borrowhistory'}/>
                <div className='content'>
                    <h2 style={{marginBottom:'20px'}}>Borrow History</h2>
                    <EnhancedTable
                        headCells={headCells}
                        rows={borrowBookHistory}
                        disableToolbar/>
                </div>

            </div>
        );
    }
}

export default BorrowHistoryPage;