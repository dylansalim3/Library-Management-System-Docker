import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Login from './pages/Login';
import Profile from './pages/Profile';
//admin pages
import Admindashboard from './pages/admin/Admindashboard';
import Addbook from './pages/admin/Addbook';
import BorrowBook from './pages/admin/BorrowReturnRenew/BorrowBook';
import axios from 'axios';
import SettingPage from './pages/admin/Setting';
//student pages
import Studentdashboard from './pages/student/Dashboard/Studentdashboard';
import SearchBook from './pages/student/SearchBook/SearchBook';
import BorrowHistoryPage from "./pages/student/BorrowHistory/BorrowHistoryPage";
import AccountRegistrationPage from "./pages/admin/AccountRegistration/AccountRegistrationPage";
import Registration from "./pages/Registration";
import StudentAccountRegistrationPage from "./pages/teacher/StudentAccountRegistrationPage";
import EditDeleteBookPage from "./pages/admin/EditDeleteBook/EditDeleteBookPage";
import RoleAssignmentPage from "./pages/admin/RoleAssignment/RoleAssignmentPage";
import EditLibraryMapPage from "./pages/admin/EditLibraryMap/EditLibraryMapPage";
import ViewLibraryMapPage from "./pages/student/ViewLibraryMap/ViewLibraryMapPage";
import BackupDatabasePage from "./pages/admin/BackupDatabase/BackupDatabasePage";
import usePushNotifications from "./UsePushNotifications";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ExtendBorrowPage from "./pages/student/ExtendBorrow/ExtendBorrowPage";
import BookReservationPage from "./pages/admin/BookReservation/BookReservationPage";
import PendingReservationPage from "./pages/student/PendingReservation/PendingReservationPage";
import {topgreen} from './style/Color';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';


import {
    ACCOUNT_REGISTRATION,
    ADD_BOOK,
    ADMIN_DASHBOARD,
    BACKUP_DATA,
    BORROW_BOOK,
    BORROW_HISTORY,
    EDIT_BOOK,
    EXTEND_BORROW,
    FORGET_PASSWORD,
    LIBRARY_MAP,
    PASSWORD_RECOVERY,
    PROFILE,
    REGISTRATION,
    RESERVATION,
    RESERVE_BOOK,
    ROLE_ASSIGNMENT,
    SEARCH_BOOK,
    STUDENT_DASHBOARD, STUDENT_REGISTRATION,
    VIEW_LIBRARY_MAP,
    SETTING, VIEW_BORROW_HISTORY
} from "./constant/route.constant";
import ViewBorrowHistory from "./pages/admin/ViewBorrowBookHistory/ViewBorrowHistory";
import FourOFourPage from "./pages/FourOFourPage";
import ErrorBoundary from "./pages/ErrorBoundary";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_BASE_URL;


const theme = createMuiTheme({
    palette: {
        primary: {
            main: topgreen,
        },
    },
});

function App() {
    const {
        onClickSendNotification,
        onEnablePush,
        error,
        loading
    } = usePushNotifications();

    useEffect(() => {

        onEnablePush();

    }, []);

    return (
        <Router>
            <ErrorBoundary>

                <div className="App">
                    <MuiThemeProvider theme={theme}>
                        <div className="container">
                            <Switch>

                                <Route exact path="/" component={Login}/>
                                <Route
                                    exact
                                    path={FORGET_PASSWORD}
                                    component={ForgetPasswordPage}
                                />
                                <Route
                                    exact
                                    path={PASSWORD_RECOVERY}
                                    component={ResetPasswordPage}
                                />

                                {/*registration*/}
                                <Route
                                    exact
                                    path={ACCOUNT_REGISTRATION}
                                    component={Registration}
                                />
                                <Route exact path={PROFILE} component={Profile}/>
                                {/* admin paths */}
                                <Route exact path={ADMIN_DASHBOARD} component={Admindashboard}/>
                                <Route exact path={ADD_BOOK} component={Addbook}/>
                                <Route exact path={BORROW_BOOK} component={BorrowBook}/>
                                <Route exact path={VIEW_BORROW_HISTORY} component={ViewBorrowHistory}/>
                                <Route
                                    exact
                                    path={RESERVE_BOOK}
                                    component={BookReservationPage}
                                />
                                <Route exact path={SEARCH_BOOK} component={SearchBook}/>
                                <Route
                                    exact
                                    path={REGISTRATION}
                                    component={AccountRegistrationPage}
                                />
                                <Route exact path={EDIT_BOOK} component={EditDeleteBookPage}/>
                                <Route
                                    exact
                                    path={ROLE_ASSIGNMENT}
                                    component={RoleAssignmentPage}
                                />
                                <Route exact path={LIBRARY_MAP} component={EditLibraryMapPage}/>
                                <Route exact path={BACKUP_DATA} component={BackupDatabasePage}/>
                                <Route exact path={SETTING} component={SettingPage}/>
                                {/* student paths */}
                                <Route
                                    exact
                                    path={STUDENT_DASHBOARD}
                                    component={Studentdashboard}
                                />
                                <Route
                                    exact
                                    path={RESERVATION}
                                    component={PendingReservationPage}
                                />
                                <Route
                                    exact
                                    path={BORROW_HISTORY}
                                    component={BorrowHistoryPage}
                                />
                                <Route exact path={EXTEND_BORROW} component={ExtendBorrowPage}/>
                                <Route
                                    exact
                                    path={VIEW_LIBRARY_MAP}
                                    component={ViewLibraryMapPage}
                                />
                                <Route
                                    exact
                                    path={STUDENT_REGISTRATION}
                                    component={StudentAccountRegistrationPage}
                                />

                                <Route component={FourOFourPage}/>

                                {/*<Route exact path="/librarian-dashboard" component={LibrarianDashboard}></Route>*/}
                            </Switch>

                        </div>

                    </MuiThemeProvider>
                </div>
            </ErrorBoundary>

        </Router>
    );
}

export default App;
