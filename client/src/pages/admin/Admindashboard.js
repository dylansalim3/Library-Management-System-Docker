import React, {Component, useEffect} from 'react';
import Sidebar from '../../components/Sidebar';
import jwt_decode from 'jwt-decode';
import '../../style/Style.css';
import AdminDashboardContent from "./AdminDashboardContent";

export default function Admindashboard(props) {
    const [first_name, setFirstName] = React.useState('');
    const [last_name, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [role, setRole] = React.useState('');

    useEffect(() => {
        if (localStorage.usertoken) {
            var token = localStorage.usertoken;
            var decoded = jwt_decode(token);
            setFirstName(decoded.first_name);
            setLastName(decoded.last_name);
            setEmail(decoded.email);
            setRole(decoded.role);
            if (decoded.role === "student" || decoded.role === "teacher") {
                props.history.push('/studentdashboard'); //push to teacher dashboard and student dashboard
                console.log("Students and teachers are not allowed to access this page.");
            }
        } else {
            props.history.push('/');
            console.log('you are not logged in');
        }
    }, [])

    return (
        <div>
            <Sidebar role={role} user={first_name} email={email}
                     selected="admindashboard"/>
            <div className="content">
                <AdminDashboardContent/>
            </div>
        </div>
    );
}

