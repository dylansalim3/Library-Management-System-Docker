import React, { Component } from 'react';
import Sidebar from '../components/Sidebar';
import jwt_decode from 'jwt-decode';
import '../style/Style.css';
import { topgreen } from '../style/Color';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { BASE_URL } from '../constant/route.constant';

const DarkerDisabledTextField = withStyles({
  root: {
    '& .MuiInputBase-root.Mui-disabled': {
      color: 'rgba(0, 0, 0, 0.6)', // (default alpha is 0.38)
    },
  },
})(TextField);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: topgreen,
    },
  },
});

export default class Profile extends Component {
  constructor() {
    super();
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      role: null,
      userid: '',
      address: null,
      phonenum: null,
      dialog: false,
      editing: false,
      profileimg: null,
      uploadprofileimg: null,
      profileimgpath: null,
      imgchanged: false,
      snackMessage: '',
      displayImg: null,
    };
  }

  uploadImage = async () => {
    if(this.state.imgchanged){
      let imageFormObj = new FormData();
      imageFormObj.append('file', this.state.uploadprofileimg);

          await axios
            .post('/file', imageFormObj)
            .then((data) => {
              this.setState({
                profileimgpath: data.data,
              });
              return data.data;
            })
            .catch((err) => {
              return;
            });
    }else{
      console.log('profile pic is not changed');
    }

    }


  getProfile = (userid) =>{
        axios.post('/users/profile', {
            userid: userid
        })
        .then(res=>{
            this.setState({
              first_name: res.data.userdata.first_name,
              last_name: res.data.userdata.last_name,
              profileimg: res.data.userdata.profileimg,
              address: res.data.userdata.address,
              phonenum: res.data.userdata.phonenum,
              displayImg: BASE_URL + res.data.userdata.profileimg,
            });
        })
  }

  updateProfile = async() =>{
    //upload img if changed
    await this.uploadImage();

    //update user profile
    let uploadprofileimgpath;
    if(this.state.imgchanged){
      uploadprofileimgpath = this.state.profileimgpath
    }else{
      uploadprofileimgpath = this.state.profileimg
    }
    if (
      this.state.first_name.length != 0 &&
      this.state.last_name.length != 0 &&
      this.state.phonenum.length != 0 &&
      this.state.address.length != 0
    ) {
      axios
        .post('/users/updateprofile', {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          userid: this.state.userid,
          profileimg: uploadprofileimgpath,
          address: this.state.address,
          phonenum: this.state.phonenum,
        })
        .then((res) => {
        });

      this.setState({
        editing: false,
        snackMessage: 'Profile updated.',
        dialog: true,
      });
    } else {
      this.setState({
        snackMessage: 'Fields cannot be empty.',
        dialog: true,
      });
    }
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
        userid: decoded.id,
        
      });
      this.getProfile(decoded.id);
    } else {
      this.props.history.push('/');
      console.log('you are not logged in');
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  selectImage = (e) => {
    this.setState({
      imgchanged: true,
      uploadprofileimg: e.target.files[0],
      profileimg: URL.createObjectURL(e.target.files[0]),
      displayImg: URL.createObjectURL(e.target.files[0]),
    });
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <Sidebar
            role={this.state.role}
            user={this.state.first_name}
            selected="profile"
          />
          <div
            className="content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h1>User Profile</h1>
            <Button
              disabled={!this.state.editing}
              onClick={() => this.refs.fileUploader.click()}
            >
              <Avatar
                alt="profileimg"
                // src={
                //   this.state.imgchanged
                //     ? BASE_URL + this.state.profileimg
                //     : this.state.profileimg
                // }
                src={this.state.displayImg}
                style={{ width: '120px', height: '120px' }}
              />
            </Button>
            <input
              type="file"
              id="file"
              ref="fileUploader"
              style={{ display: 'none' }}
              onChange={(e) => this.selectImage(e)}
            />
            <DarkerDisabledTextField
              disabled
              label="Role"
              variant="outlined"
              name="role"
              value={
                this.state.role
                  ? this.state.role.charAt(0).toUpperCase() +
                    this.state.role.slice(1)
                  : ''
              }
              className=" profileInput gridmargin"
            />
            <DarkerDisabledTextField
              disabled
              label="Library ID"
              variant="outlined"
              name="userid"
              value={this.state.userid}
              onChange={this.onChange}
              className="profileInput gridmargin"
            />
            <DarkerDisabledTextField
              disabled={!this.state.editing}
              label="First Name"
              variant="outlined"
              name="first_name"
              value={this.state.first_name}
              onChange={this.onChange}
              className="profileInput gridmargin"
            />
            <DarkerDisabledTextField
              disabled={!this.state.editing}
              label="Last Name"
              variant="outlined"
              name="last_name"
              value={this.state.last_name}
              onChange={this.onChange}
              className="profileInput gridmargin"
            />
            <DarkerDisabledTextField
              disabled
              label="Email Address"
              variant="outlined"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              className="profileInput gridmargin"
            />
            <DarkerDisabledTextField
              disabled={!this.state.editing}
              label="Phone number"
              variant="outlined"
              name="phonenum"
              value={this.state.phonenum ? String(this.state.phonenum) : ''}
              onChange={this.onChange}
              className="profileInput gridmargin"
            />
            <DarkerDisabledTextField
              disabled={!this.state.editing}
              multiline
              rows={4}
              label="Home Address"
              variant="outlined"
              name="address"
              // defaultValue={this.state.address}
              value={this.state.address ? String(this.state.address) : ''}
              onChange={this.onChange}
              className="profileInput gridmargin"
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
                disabled={this.state.editing}
                variant="contained"
                onClick={() => this.setState({ editing: true })}
                style={{ width: '40%', maxWidth: '230px', height: '40px' }}
              >
                Edit
              </Button>
              <Button
                disabled={!this.state.editing}
                variant="contained"
                onClick={() => this.updateProfile()}
                style={{
                  backgroundColor: '#2B8C96',
                  marginLeft: '20px',
                  width: '40%',
                  maxWidth: '230px',
                  height: '40px',
                }}
              >
                Save
              </Button>
            </div>
          </div>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            open={this.state.dialog}
            autoHideDuration={6000}
            onClose={() => this.setState({ dialog: false })}
            message={this.state.snackMessage}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => this.setState({ dialog: false })}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

