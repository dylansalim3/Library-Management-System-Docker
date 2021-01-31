import React, {useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import TextField from "@material-ui/core/TextField/TextField";
import {useForm} from "react-hook-form";
import {Button, makeStyles, Paper} from "@material-ui/core";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Alert from "@material-ui/lab/Alert/Alert";
import {useSnackbar} from "notistack";
import AlertDialog from "../components/AlertDialog";
import Box from "@material-ui/core/Box/Box";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {topgreen} from "../style/Color";
import mainLogo from "../images/mainlogo.png";
import {useLocation} from "react-router";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: topgreen,
        },
    },
});

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

const ResetPasswordPage = (props) => {
    const classes = useStyles();

    const [verificationHash, setVerificationHash] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmationPassword, setConfirmationPassword] = useState('');

    const {register, handleSubmit, watch, setValue, errors} = useForm();
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const {enqueueSnackbar} = useSnackbar();

    const useQuery = () =>{
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();
    useEffect(() => {
        setVerificationHash(query.get('hash'));
        axios.post('users/get-user-by-verification-hash', {
            hash: query.get('hash'),
        }).then(res => {
            if (res.data.user) {
                setEmail(res.data.user.email);
            }
        })
    }, []);

    const onSubmit = () => {
        axios.post('users/reset-password', {
            'email': email,
            'verificationHash': verificationHash,
            'newPassword': confirmationPassword
        }).then(res => {
            setShowSuccessDialog(true);
        }).catch(err => {
            enqueueSnackbar('Password reset failed', {variant: 'error', transitionDuration: 1000});
        })
    };

    const isPasswordEqual = () => password === confirmationPassword;

    const onCloseSuccessfulModal = () => {
        setShowSuccessDialog(false);
        props.history.push('/');
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box>
                        <h1>Password Recovery</h1>
                    </Box>
                    <Box p={1}>
                        <TextField
                            style={{width: '250px'}}
                            label="Email Address"
                            variant="outlined"
                            name="email"
                            disabled
                            value={email}
                            required
                            type="email"
                        />
                    </Box>
                    <Box p={1}>
                        <TextField
                            style={{width: '250px'}}
                            label="Password"
                            variant="outlined"
                            name="password"
                            inputRef={register({
                                // required: 'Field cannot leave blank',
                                min: {value: 8, message: "Password must contain minimum 8 characters"}
                            })}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            error={errors?.password != null}
                            helperText={errors?.password && errors.password.message}
                            value={password}
                            type="password"
                        />
                    </Box>
                    <Box p={1}>
                        <TextField
                            style={{width: '250px'}}
                            label="Password Confirmation"
                            variant="outlined"
                            name="confirmationPassword"
                            inputRef={register({
                                validate: {isPasswordEqual: value => isPasswordEqual() || 'Both password must be equal'}
                            })}
                            error={errors?.confirmationPassword != null}
                            helperText={errors?.confirmationPassword && errors.confirmationPassword.message}
                            value={confirmationPassword}
                            // type="password"
                            onChange={(e) => setConfirmationPassword(e.target.value)}
                            required
                            type="password"
                        />
                    </Box>

                    <div className="flex-justify-center" style={{marginTop: 15}}>
                        <Button variant="contained"
                                color="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
                <AlertDialog
                    title="Password Reset Successful"
                    desc="Your password have been updated. Proceed to Login"
                    confirmationText="OK"
                    showAlertModal={showSuccessDialog}
                    onCloseConfirmationModal={onCloseSuccessfulModal}
                />
            </Box>
                </div>
            </Box>
        </MuiThemeProvider>
    );
};

export default ResetPasswordPage;