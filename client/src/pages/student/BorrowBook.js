import React, {Component} from 'react';

class BorrowBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            role: null
        }
    }
    componentDidMount() {
        if (localStorage.usertoken) {
            var token = localStorage.usertoken;
            var decoded = jwt_decode(token);
            this.setState({first_name: decoded.first_name, last_name: decoded.last_name, email: decoded.email, role: decoded.role});

            if (decoded.role === 'admin' || decoded.role === 'librarian') {
                this
                    .props
                    .history
                    .push('/admindashboard'); //push to admin dashboard and librarian dashboard
                console.log('Only students and teachers are allowed to access this page.');
            }
        } else {
            this
                .props
                .history
                .push('/');
            console.log('you are not logged in');
        }
    }
    render() {
        return (
            <div class="center">
                <h2>This is the borrow book page</h2>
            </div>
        );
    }
}

export default;