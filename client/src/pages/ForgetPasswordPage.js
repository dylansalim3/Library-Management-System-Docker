import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import {useForm} from "react-hook-form";
import {Box, Button, makeStyles, Paper} from "@material-ui/core";
import * as axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {topgreen} from "../style/Color";
import mainLogo from './../images/mainlogo.png';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: topgreen,
        },
    },
});

const ForgetPasswordPage = () => {
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const {register, handleSubmit, watch, setValue, errors} = useForm();
    const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);

    const useStyles = makeStyles((theme) => ({
        outerContainer: {
            background: "#edeef2"
        },
        mainContainer: {
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '50vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
    }));

    const classes = useStyles();

    const onChange = (e) => {
        setRecoveryEmail(e.target.value);
    };

    const onSubmit = () => {
        axios.post("users/password-recovery", {
            email: recoveryEmail,
            resetPasswordLinkPrefix: process.env.REACT_APP_WEB_BASE_URL + 'password-recovery'
        }).then(result => {
            setOpenSuccessSnackbar(true);
        }).catch(err => {
            setOpenErrorSnackbar(true);
        });
    };

    return (
        <MuiThemeProvider theme={theme}>
            <Box width="100%" className={classes.outerContainer}>

                <div className={classes.mainContainer}>
                    <div style={{margin: "20px"}}>

                        <img src={mainLogo} alt="logo"/>
                    </div>


                    <Box display="flex" component={Paper}
                         container
                         style={{
                             padding: '20px 50px',
                             flexDirection: 'column',
                             alignItems: 'center',
                             justifyContent: 'space-around',
                             height: '40vh',
                         }}
                    >

                        <h1>Password Reset</h1>
                        <p style={{width: '300px'}}>
                            Please enter your email address for your account. A verification code will be sent to you.
                            Once you have received the verification code. You will be able to choose a new password for
                            your account.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                style={{width: '300px'}}
                                label="Email Address"
                                variant="outlined"
                                name="email"
                                inputRef={register({
                                    required: true, pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "invalid email address"
                                    }
                                })}
                                error={errors?.email}
                                helperText={errors?.email && "Please enter a valid email address"}
                                value={recoveryEmail}
                                onChange={onChange}
                                required
                                type="email"
                            />

                            <div className="flex-justify-center" style={{marginTop: 15}}>
                                <Button variant="contained"
                                        color="primary" type="submit">
                                    Submit
                                </Button>
                            </div>

                        </form>

                        <Snackbar open={openErrorSnackbar} autoHideDuration={3000} onClose={() => {
                            setOpenErrorSnackbar(false)
                        }}>
                            <Alert onClose={() => {
                                setOpenErrorSnackbar(false)
                            }} severity="error">
                                Error occured. Please try again later
                            </Alert>
                        </Snackbar>

                        <Snackbar open={openSuccessSnackbar} autoHideDuration={3000} onClose={() => {
                            setOpenSuccessSnackbar(false)
                        }}>
                            <Alert onClose={() => {
                                setOpenSuccessSnackbar(false)
                            }} severity="success">
                                This is a success message!
                            </Alert>
                        </Snackbar>
                    </Box>
                </div>
            </Box>

        </MuiThemeProvider>
    );
};

export default ForgetPasswordPage;
