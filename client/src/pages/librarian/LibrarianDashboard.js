import React, {Component} from 'react';
import Sidebar from "../../components/Sidebar";
import jwt_decode from "jwt-decode";

class LibrarianDashboard extends Component {
    constructor() {
        super();
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            role: null,
        };
    }

    componentDidMount() {
        if (localStorage.usertoken) {
            var token = localStorage.usertoken;
            var decoded = jwt_decode(token);
            this.setState({
                first_name: decoded.first_name,
                last_name: decoded.last_name,
                email: decoded.email,
                role: decoded.role,
            });
            if (decoded.role === 'admin' || decoded.role === 'librarian') {
                this.props.history.push('/admindashboard'); //push to admin dashboard and librarian dashboard
                console.log(
                    'Only students and teachers are allowed to access this page.'
                );
            }
        } else {
            this.props.history.push('/');
            console.log('you are not logged in');
        }
    }

    render() {
        return (
            <div>
                <Sidebar
                    role={this.state.role}
                    user={this.state.first_name}
                    selected="librarian"
                />
                <div className="content">
                    <h1>this is dashboard for students and teachers</h1>
                </div>
            </div>
        );
    }
}

export default LibrarianDashboard;