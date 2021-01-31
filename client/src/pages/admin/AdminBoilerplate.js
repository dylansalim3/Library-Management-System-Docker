import React, {Component} from 'react';
import jwt_decode from "jwt-decode";
import Sidebar from "../../components/Sidebar";
import {withRouter} from 'react-router-dom';

class AdminBoilerplate extends Component {
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

            if (decoded.role === "student" || decoded.role === "teacher") {
                this.props.history.push('/studentdashboard'); //push to teacher dashboard and student dashboard
                console.log("Students and teachers are not allowed to access this page.");
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

export default withRouter(AdminBoilerplate);