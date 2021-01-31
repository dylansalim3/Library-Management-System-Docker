import React, {Component} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import {topgreen} from '../style/Color';
import logo from '../images/mainlogo.png';
import homepageLogo from '../images/homepage_background@2x_transparent.png';
import Footer from "./Footer";
import NewArrivalBook from "../components/NewArrivalBook";
import "./../App.css";
import {withSnackbar} from 'notistack';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: topgreen,
        },

    },

});


class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            role: 'student',
            dialog: false,
            errormessage: '',
        };
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.login();
    };

    login() {
        axios
            .post('users/loginwithrole', {
                email: this.state.email,
                password: this.state.password,
                role: this.state.role,
            })
            .then((res) => {
                if (res.data.error) {
                    this.props.enqueueSnackbar('Error occurred. Please Try Again Later', {
                        variant: 'error',
                        transitionDuration: 1000
                    });
                } else {
                    localStorage.setItem('usertoken', res.data.token);
                    if (this.state.role === 'admin' || this.state.role === 'librarian') {
                        this.props.history.push('/admindashboard');
                    } else if (
                        this.state.role === 'student' ||
                        this.state.role === 'teacher'
                    ) {
                        this.props.history.push('/studentdashboard');
                    }
                }
            })
            .catch((err) => {
                this.props.enqueueSnackbar("Incorrect combination of email and password or wrong role selected", {
                    variant: 'error',
                    transitionDuration: 3000
                });
            });
    }


    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Grid
                    container
                    spacing={0}
                    style={{
                        background: "linear-gradient(#f1f1f1, #d5e0f3)",
                        minHeight: `65vh`,
                    }}
                >
                    <Grid item xs={12} sm={9}>
                        <img src={homepageLogo} alt="homepage-logo" style={{maxWidth: "100%",}}/>
                    </Grid>
                    <Grid item xs={12} sm={3} style={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                        <img src={logo} alt="e-library logo"/>
                        <h1 style={{color: topgreen}}>User Login</h1>

                        <form onSubmit={this.onSubmit} style={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "column",
                            alignItems: "center",
                        }}>
                            <TextField
                                style={{width: "300px"}}
                                id="outlined-basic1"
                                label="Email Address"
                                variant="outlined"
                                name="email"
                                value={this.state.email}
                                onChange={this.onChange}
                                required
                                type="email"
                            />

                            <TextField
                                style={{margin: "10px", width: "300px"}}
                                type="password"
                                id="outlined-basic"
                                label="Password"
                                variant="outlined"
                                name="password"
                                value={this.state.password}
                                onChange={this.onChange}
                                required
                            />
                            <Grid item xs={12} style={{marginTop: '15px'}}>
                                <TextField
                                    select
                                    label="Role"
                                    name="role"
                                    value={this.state.role}
                                    onChange={this.onChange}
                                    helperText="Please select your user role"
                                    variant="outlined"
                                    style={{width: '300px'}}
                                >
                                    <MenuItem value="student">Student</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="teacher">Teacher</MenuItem>
                                    <MenuItem value="librarian">Librarian</MenuItem>
                                </TextField>
                            </Grid>
                            <div>
                                <small><a href="/forget-password">Forget Password?</a></small>
                            </div>
                            <div style={{marginTop: '15px'}}>
                                <Button
                                    style={{width: '250px'}}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    </Grid>
                </Grid>
                <div style={{background: "#d5e0f3", padding: "30px"}}>
                    <NewArrivalBook reserve={false}/>
                </div>
                <Footer/>
            </MuiThemeProvider>
        );
    }
}

export default withSnackbar(Login);
