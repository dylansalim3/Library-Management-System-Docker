import React, {Component} from 'react';
import axios from 'axios';
import {Paper, TextField} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import AlertDialog from "../components/AlertDialog";
import mainLogo from "../images/mainlogo.png";
import Box from "@material-ui/core/Box/Box";

const DarkerDisabledTextField = withStyles({
    root: {
        '& .MuiInputBase-root.Mui-disabled': {
            color: 'rgba(0, 0, 0, 0.6)', // (default alpha is 0.38)
        },
    },
})(TextField);

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                role: null,
                active: null,
                created: '',
                email: "",
                first_name: "",
                id: null,
                last_name: "",
                password: "",
                verification_hash: null,
            },
            location: props.location,
        }
    }

    useQuery = () => {
        return new URLSearchParams(this.state.location.search);
    }

    componentDidMount() {
        let hash = new URLSearchParams(this.state.location.search).get('hash');
        axios.post('users/get-user-by-verification-hash', {
            hash: hash,
        }).then(res => {
            if (res.data.user.active) {
                this.setState({
                    dialogTitle: 'Access Denied',
                    dialogDesc: 'You have completed the registration. Please Log In.',
                    dialogConfirmationText: 'Go to Login',
                    dialog: true,
                });
            } else {
                this.setState({
                    user: {
                        id: res.data.user.id,
                        email: res.data.user.email,
                        first_name: res.data.user.first_name,
                        last_name: res.data.user.last_name,
                        profileimg: res.data.user.profileimg,
                        address: res.data.user.address,
                        phonenum: res.data.user.phonenum,
                        role: res.data.role.role,
                    }
                });
            }
        }).catch(err => {
            this.setState({
                dialogTitle: 'Access Denied',
                dialogDesc: 'You have completed the registration. Please Log In.',
                dialogConfirmationText: 'Go to Login',
                dialog: true,
            });
        })

    }

    uploadImage = async () => {
        if (this.state.user.imgchanged) {
            let imageFormObj = new FormData();
            imageFormObj.append('file', this.state.user.uploadprofileimg);

            await axios
                .post('/file', imageFormObj)
                .then((data) => {
                    this.setState({
                        user: {
                            ...this.state.user,
                            profileimgpath: data.data,
                        },
                    });
                    return data.data;
                })
                .catch((err) => {
                    console.log(err);
                    return;
                });
        } else {
            console.log('profile pic is not changed');
        }

    }

    updateProfile = async () => {
        //upload img if changed
        await this.uploadImage();

        //update user profile
        let uploadprofileimgpath;
        if (this.state.user.imgchanged) {
            uploadprofileimgpath = this.state.user.profileimgpath
        } else {
            uploadprofileimgpath = this.state.user.profileimg
        }
        axios
            .post('/users/complete-registration', {
                first_name: this.state.user.first_name,
                last_name: this.state.user.last_name,
                userid: this.state.user.id,
                profileimg: uploadprofileimgpath,
                address: this.state.user.address,
                phonenum: this.state.user.phonenum,
                password: this.state.user.password,
            })
            .then((res) => {
                this.setState({
                    dialogTitle: 'Success',
                    dialogDesc: 'Registration Successful!',
                    dialogConfirmationText: 'Go to Login',
                    dialog: true,
                });
            });


    };

    onChange = (e) => {
        this.setState({
            user: {
                ...this.state.user,
                [e.target.name]: e.target.value
            }
        });
    };

    selectImage = (e) => {
        this.setState({
            user: {
                ...this.state.user,
                uploadprofileimg: e.target.files[0],
                profileimg: URL.createObjectURL(e.target.files[0]),
                imgchanged: true,
            },
        });
    };

    onCloseSuccessfulModal = () => {
        this.setState({dialog: false});
        this.props.history.push('/');
    };

    render() {
        return (
            <Box width="100%" style={{
                background: "#edeef2"
            }}>

                <div style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    height: '130vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems:'center',
                    justifyContent: 'flex-start'
                }}>
                    <div style={{margin: "20px"}}>
                        <a href="/">
                            <img src={mainLogo} alt="logo"/>
                        </a>
                    </div>


                    <Box display="flex" component={Paper}
                         container
                         style={{
                             width:'70vw',
                             padding: '20px 50px',
                             flexDirection: 'column',
                             alignItems: 'center',
                             justifyContent: 'space-around',
                         }}
                    >
                        <h2 className="textCenter">Account Registration</h2>
                        <p className="textCenter">Please complete your registration</p>
                        <Button
                            onClick={() => this.refs.fileUploader.click()}
                        >
                            <Avatar
                                alt="profileimg"
                                src={this.state.user.profileimg}
                                style={{width: '120px', height: '120px'}}
                            />
                        </Button>
                        <input
                            type="file"
                            id="file"
                            ref="fileUploader"
                            style={{display: 'none'}}
                            onChange={(e) => this.selectImage(e)}
                        />
                        <DarkerDisabledTextField
                            label="Role"
                            name="role"
                            value={String(this.state.user.role).charAt(0).toUpperCase() + String(this.state.user.role).slice(1)}
                            variant="outlined"
                            disabled
                            className=" profileInput gridmargin"
                        />
                        <DarkerDisabledTextField
                            label="Library ID"
                            name="userId"
                            value={String(this.state.user.id)}
                            variant="outlined"
                            disabled
                            className=" profileInput gridmargin"
                        />
                        <DarkerDisabledTextField
                            label="First Name"
                            name="first_name"
                            value={this.state.user.first_name}
                            required
                            variant="outlined"
                            onChange={e => this.onChange(e)}
                            className=" profileInput gridmargin"
                        />
                        <DarkerDisabledTextField
                            label="Last Name"
                            name="last_name"
                            required
                            value={this.state.user.last_name}
                            variant="outlined"
                            onChange={e => this.onChange(e)}
                            className=" profileInput gridmargin"
                        />
                        <DarkerDisabledTextField
                            label="Email"
                            name="email"
                            variant="outlined"
                            value={this.state.user.email}
                            disabled
                            className=" profileInput gridmargin"
                        />
                        <DarkerDisabledTextField
                            label="Phone number"
                            variant="outlined"
                            name="phonenum"
                            value={this.state.user.phonenum ? String(this.state.user.phonenum) : null}
                            onChange={this.onChange}
                            className="profileInput gridmargin"
                        />
                        <DarkerDisabledTextField
                            multiline
                            rows={4}
                            label="Home Address"
                            variant="outlined"
                            name="address"
                            value={this.state.user.address ? String(this.state.user.address) : null}
                            onChange={this.onChange}
                            className="profileInput gridmargin"
                        />
                        <DarkerDisabledTextField
                            label="Password"
                            name="password"
                            type="password"
                            required
                            variant="outlined"
                            onChange={e => this.onChange(e)}
                            className=" profileInput gridmargin"
                        />
                        <div
                            style={{
                                marginTop: '50px',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => this.updateProfile()}
                                style={{width: '40%', maxWidth: '230px', height: '40px'}}
                            >
                                Submit
                            </Button>
                        </div>
                        <AlertDialog
                            title={this.state.dialogTitle}
                            desc={this.state.dialogDesc}
                            confirmationText={this.state.dialogConfirmationText}
                            showAlertModal={this.state.dialog}
                            onCloseConfirmationModal={this.onCloseSuccessfulModal}
                        />
                    </Box>
                </div>
            </Box>

        );
    }
}

export default Registration;