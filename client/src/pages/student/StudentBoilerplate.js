import React, {Component} from 'react';
import jwt_decode from 'jwt-decode';
import Sidebar from '../../components/Sidebar';
import {withRouter} from 'react-router-dom';


class StudentBoilerplate extends Component {
    constructor(props) {
        super(props);
        this.state = {}
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
        let innerJSX = this.props.innerJSX;
        return (<div>
            <Sidebar
                role={this.state.role}
                user={this.state.first_name}
                selected={this.props.page}
            /></div>);
    }
}

export default withRouter(StudentBoilerplate);