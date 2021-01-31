import React, { Component } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import jwt_decode from 'jwt-decode';
import '../../style/Style.css';
import TextField from '@material-ui/core/TextField';
import { topgreen, drawergreen } from '../../style/Color';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {FormControl } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import AdminBoilerplate from "./AdminBoilerplate";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import addIcon from '../../images/add_blue.png';
import deleteIcon from '../../images/delete.png';
import * as html2canvas from 'html2canvas';

var Barcode = require('react-barcode');
var today = new Date();
var month,day="";

if(today.getMonth()+1<10){
  month="0"+(today.getMonth()+1);
}else{
  month = today.getMonth()+1;
}
if (today.getDate() < 10) {
  day = '0' + today.getDate();
}else{
  day = today.getDate();
}
var todayDate = today.getFullYear() +'-' +month +'-' + day;


const defaultState = {
  first_name: '',
  last_name: '',
  email: '',
  role: null,
  bookcover: null,
  bookimg: null,
  bookimgpath: null,
  isbn: '',
  booktitle: '',
  author: '',
  datepublished: '',
  publisher: '',
  type: '',
  ebook: null,
  ebookpath: null,
  ebookdisabled: true,
  category: '',
  genre: '',
  summary: '',
  location: '',
  status: 'available',
  dialogopen: false,
  addedBookID: '',
  dialogAddNew: false,
  dialogDelete: false,
  newFieldName: '',

  toastMessage: false,
  newFieldText: '',
  deleteFieldText: '',
  toastMessageText: '',
  genreData: [],
  categoryData: [],
  authorData: [],
  deleteValue: '',
};


export default class Addbook extends Component {
  constructor() {
    super();
    this.state = Object.assign({}, defaultState);

  }

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = () => {
    axios
      .get('/genres/get-all-genre')
      .then((res) => {
        this.setState({ genreData: res.data });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
      });

    axios
      .get('/bookCategory/get-all-category')
      .then((res) => {
        this.setState({ categoryData: res.data });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
      });

    axios
      .get('/author/get-all-authors')
      .then((res) => {
        this.setState({ authorData: res.data });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
      });
  };

  retrieveOptions = (type) => {
    if (type === 'genre') {
      return this.state.genreData.map((data) => (
        <option key={data.id} value={data.id}>
          {data.name}
        </option>
      ));
    } else if (type === 'category') {
      return this.state.categoryData.map((data) => (
        <option key={data.id} value={data.id}>
          {data.name}
        </option>
      ));
    } else if (type === 'author') {
      return this.state.authorData.map((data) => (
        <option key={data.id} value={data.id}>
          {data.name}
        </option>
      ));
    }
  };

  downloadBarcode = () => {
    const input = document.getElementById('barcodeField');
    html2canvas(input)
      .then((canvas)=>{
        const imgData = canvas.toDataURL('image/png');
        var a = document.createElement('a');
        const fileName = String(this.state.addedBookID) + ".png";
        a.setAttribute('download', fileName);
        a.setAttribute('href', imgData);
        a.click();
      })
      .catch(e=>console.log(e));
  }


  selectEbook = (e) => {
    this.setState({
      ebook: e.target.files[0],
      // bookimg: URL.createObjectURL(e.target.files[0]),
    });
  };

  selectImage = (e) => {
    this.setState({
      bookcover: e.target.files[0],
      bookimg: URL.createObjectURL(e.target.files[0]),
    });
  };

  uploadEbook = async (ebookFormObj) => {
    if (this.state.ebook) {
      await axios
        .post('/file-ebook', ebookFormObj)
        .then((data) => {
          this.setState({
            ebookpath: data.data,
          });
          return data.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    } else {
      console.log('Ebook is empty');
    }
  };

  uploadImage = async (imageFormObj) => {
    if (this.state.bookimg) {
      await axios
        .post('/file', imageFormObj)
        .then((data) => {
          this.setState({
            bookimgpath: data.data,
          });
          return data.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    } else {
      console.log('Book cover is empty');
    }
  };

  uploadBook = async (imageFormObj, ebookFormObj) => {
    await this.uploadImage(imageFormObj);
    await this.uploadEbook(ebookFormObj);

       await axios
          .post('/books/add', {
            isbn: this.state.isbn,
            title: this.state.booktitle,
            datepublished: this.state.datepublished,
            bookimg: this.state.bookimgpath,
            status: this.state.status,
            publisher: this.state.publisher,
            type: this.state.type,
            ebook: this.state.ebookpath,
            category: this.state.category,
            genre: this.state.genre,
            summary: this.state.summary,
            location: this.state.location,
            author: this.state.author,
          })
          .then((res) => {

            this.setState({
              addedBookID: res.data.bookdetail.id,
              dialogopen: true,
            });

            //upload barcode
            const input = document.getElementById('barcodeField');
            html2canvas(input).then((canvas) => {
              const imgData = canvas.toDataURL('image/png');
              axios
                .post('/file-barcode', {
                  img: imgData,
                  id: this.state.addedBookID,
                })
                .then((data) => {
                  axios
                    .post('book-details/update-barcodepath', {
                      bookId: this.state.addedBookID,
                      barcodePath: data.data,
                    })
                    .then((res) => {
                      console.log(res);
                    })
                    .catch(e=>{
                      console.log(e);
                    })
                })
                .catch((err) => {
                  console.log(err);
                  return;
                });
            });


          })
          .catch((err) => {
            console.log(err);
          });



  };

  onSubmit = async (e) => {
    e.preventDefault();
    let imageFormObj = new FormData();
    imageFormObj.append('file', this.state.bookcover);
    let ebookFormObj = new FormData();
    ebookFormObj.append('file', this.state.ebook);
    this.uploadBook(imageFormObj, ebookFormObj);
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    if(e.target.name==='type'){
      if(e.target.value==='digital'){
        this.setState({ebookdisabled: false });
      }else if(e.target.value==='physical'){
        this.setState({ebookdisabled:true});
      }
    }
  };

  openSecDialog = (type) => {
    this.setState({
      newFieldText: type,
      dialogAddNew: true,
    });
  };

  openDeleteDialog = (type) => {
    this.setState({
      deleteFieldText: type,
      dialogDelete: true,
    });
  }

  closeSecDialog = () => {
    this.setState({ dialogAddNew: false });
  };

  closeThirdDialog = () => {
    this.setState({ dialogDelete: false});
  }

  openToastMessage = (type) => {
    if (type === 'author') {
      this.setState({ toastMessageText: 'New author added.' });
    } else if (type === 'category') {
      this.setState({ toastMessageText: 'New category added.' });
    } else if (type === 'genre') {
      this.setState({ toastMessageText: 'New genre added.' });
    } else if (type === 'deletecategory') {
      this.setState({ toastMessageText: 'Category successfully deleted.' });
    } else if (type === 'deletegenre') {
      this.setState({ toastMessageText: 'Genre successfully deleted.' });
    } else if(type === 'deletefailed'){
      this.setState({toastMessageText: 'Failed to delete field. Make sure there is no book allocated to this field.'});
    }
    this.setState({ toastMessage: true });
  };

  closeToastMessage = () => {
    this.setState({ toastMessage: false });
  };

  deleteField = () => {
    let deleteType = this.state.deleteFieldText;
    try{
    if (deleteType === 'category') {
        axios
          .post('/bookCategory/delete', {
            deleteFieldName: this.state.deleteValue,
          })
          .then((res) => {
          })
          .catch((err) => {
            console.log(err);
            
          })
          .finally(() => {
            this.retrieveData();
            this.closeThirdDialog();
            this.openToastMessage("delete"+deleteType);
          });
      } else if (deleteType === 'genre') {
        axios
          .post('/genres/delete', {
            deleteFieldName: this.state.deleteValue,
          })
          .then((res) => {
                this.retrieveData();
                this.closeThirdDialog();
                this.openToastMessage('delete' + deleteType);
          })
          .catch((err) => {
            console.log(err.message);
            if(err.response.data.message.name==undefined){
                this.retrieveData();
                this.closeThirdDialog();
                this.openToastMessage('delete' + deleteType);
            }else{
                this.retrieveData();
                this.closeThirdDialog();
                this.openToastMessage('deletefailed');
            }
          });
      }
    } catch (err) {
      console.log(err);
    } finally {
      // this.setState({ newFieldName: '' });
      // dont modify the code here first, bugs will appear
    }
  }
  

  addNewField = () => {
    let newType = this.state.newFieldText;
    try {
      if (newType === 'author') {
        axios
          .post('/author/add', {
            newFieldName: this.state.newFieldName,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.retrieveData();
            this.closeSecDialog();
            this.openToastMessage(newType);
          });
      } else if (newType === 'category') {
        axios
          .post('/bookCategory/add', {
            newFieldName: this.state.newFieldName,
          })
          .then((res) => {
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.retrieveData();
            this.closeSecDialog();
            this.openToastMessage(newType);
          });
      } else if (newType === 'genre') {
        axios
          .post('/genres/add', {
            newFieldName: this.state.newFieldName,
          })
          .then((res) => {
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.retrieveData();
            this.closeSecDialog();
            this.openToastMessage(newType);
          });
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.setState({ newFieldName: '' });
      // dont modify the code here first, bugs will appear
    }
  };

  render() {
    const CssTextField = withStyles({
      root: {
        '& .MuiInputLabel-outlined': {
          color: drawergreen,
        },
        '& label.Mui-focused': {
          color: topgreen,
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: topgreen,
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: topgreen,
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: topgreen,
          },
          '&.Mui-focused fieldset': {
            borderColor: topgreen,
          },
        },
      },
    })(TextField);

    return (
      <div>
        <AdminBoilerplate page="add_book" />

        {/* Snackbar to display toast message */}
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.toastMessage}
          autoHideDuration={6000}
          onClose={this.closeToastMessage}
          message={this.state.toastMessageText}
          action={
            <React.Fragment>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.closeToastMessage}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
        {/* Dialog for adding new ,category,genre */}
        <Dialog open={this.state.dialogAddNew} onClose={this.closeSecDialog}>
          <DialogTitle style={{ textAlign: 'center' }}>
            Add a new {this.state.newFieldText}?
          </DialogTitle>
          <DialogContent>
            <DialogActions>
              <div
                style={{
                  minWidth: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <TextField
                  label="Type in value"
                  variant="outlined"
                  name="newFieldName"
                  value={this.state.newFieldName}
                  onChange={this.onChange}
                />
                <Button
                  variant="contained"
                  onClick={this.addNewField}
                  style={{
                    marginTop: '20px',
                    backgroundColor: topgreen,
                    color: 'white',
                  }}
                >
                  Confirm
                </Button>
              </div>
            </DialogActions>
          </DialogContent>
        </Dialog>

        {/* Dialog for deleting category,genre */}
        <Dialog open={this.state.dialogDelete} onClose={this.closeThirdDialog}>
          <DialogTitle style={{ textAlign: 'center' }}>
            Delete {this.state.deleteFieldText}?
          </DialogTitle>
          <DialogContent>
            <DialogActions>
              <div
                style={{
                  minWidth: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <FormControl variant="outlined">
                  <InputLabel htmlFor="deleteField">
                    {this.state.deleteFieldText}
                  </InputLabel>
                  <Select
                    native
                    required
                    value={this.state.deleteValue}
                    onChange={this.onChange}
                    inputProps={{
                      name: 'deleteValue',
                      id: 'deleteField',
                    }}
                  >
                    <option aria-label="None" value="" />
                    {this.retrieveOptions(this.state.deleteFieldText)}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  onClick={this.deleteField}
                  style={{
                    marginTop: '20px',
                    backgroundColor: 'red',
                    color: 'white',
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogActions>
          </DialogContent>
        </Dialog>

        {/* Dialog for adding new book */}
        <Dialog
          open={this.state.dialogopen}
          onClose={() => {
            this.setState(Object.assign({}, defaultState));
            // document.getElementById('uploadCaptureInputFile').value = '';
            this.retrieveData();
          }}
        >
          <DialogTitle>Book has been added succesfully</DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              Please download and print the generated barcode below and paste it
              on the book.
              <div id="barcodeField">
                <Barcode
                  id="barcode"
                  style={{ width: '100%', backgroundColor: 'red' }}
                  value={String(this.state.addedBookID)}
                />
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.downloadBarcode}>
              Download
            </Button>

            <Button
              onClick={() => {
                this.setState(Object.assign({}, defaultState));
                document.getElementById('uploadField').value = '';
                this.retrieveData();
              }}
              color="primary"
              autoFocus
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <div className="content">
          <Grid container>
            <form
              style={{ width: '100%' }}
              onSubmit={(e) => {
                this.onSubmit(e);
                return false;
              }}
            >
              <Grid item xs={12}>
                <h1>Add Book</h1>
              </Grid>
              <Grid container>
                <Grid item sm={4} xs={12}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      label="ISBN"
                      variant="outlined"
                      name="isbn"
                      value={this.state.isbn}
                      onChange={this.onChange}
                      className="gridWidth gridmargin"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      label="Book Title"
                      variant="outlined"
                      name="booktitle"
                      value={this.state.booktitle}
                      onChange={this.onChange}
                      className={'gridWidth gridmargin'}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <TextField
                      required
                      label="Author"
                      variant="outlined"
                      name="author"
                      value={this.state.author}
                      onChange={this.onChange}
                      className={'gridWidth gridmargin'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      type="date"
                      label="Date Published"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        inputProps: { max: todayDate },
                      }}
                      name="datepublished"
                      value={this.state.datepublished}
                      onChange={this.onChange}
                      className={'gridWidth gridmargin'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      label="Publisher"
                      variant="outlined"
                      name="publisher"
                      value={this.state.publisher}
                      onChange={this.onChange}
                      className={'gridWidth gridmargin'}
                    />
                  </Grid>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Grid style={{ marginBottom: '25px' }} item xs={12}>
                    <FormControl
                      required
                      className={'gridWidth gridmargin'}
                      variant="outlined"
                    >
                      <InputLabel htmlFor="booktype">Type</InputLabel>
                      <Select
                        native
                        required
                        value={this.state.type}
                        onChange={this.onChange}
                        inputProps={{
                          name: 'type',
                          id: 'booktype',
                        }}
                      >
                        <option aria-label="None" value="" />
                        <option value={'digital'}>Digital</option>
                        <option value={'physical'}>Physical</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <h3 style={{ marginBottom: '10px' }}>
                      Select and upload Ebook
                    </h3>
                    <input
                      required
                      disabled={this.state.ebookdisabled}
                      type="file"
                      onChange={(e) => this.selectEbook(e)}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <FormControl
                      required
                      className={'gridSecWidth gridmargin'}
                      variant="outlined"
                    >
                      <InputLabel htmlFor="bookcategory">Category</InputLabel>
                      <Select
                        native
                        required
                        value={this.state.category}
                        onChange={this.onChange}
                        inputProps={{
                          name: 'category',
                          id: 'bookcategory',
                        }}
                      >
                        <option aria-label="None" value="" />
                        {this.retrieveOptions('category')}
                      </Select>
                    </FormControl>
                    <div
                      style={{ marginLeft: '15px' }}
                      className={'gridmargin'}
                    >
                      <Link
                        onClick={() => this.openSecDialog('category')}
                        style={{ color: 'red' }}
                      >
                        <img
                          src={addIcon}
                          style={{ width: '20px', height: '20px' }}
                        />
                      </Link>
                    </div>
                    <div
                      style={{ marginLeft: '15px' }}
                      className={'gridmargin'}
                    >
                      <Link
                        onClick={() => this.openDeleteDialog('category')}
                        style={{ color: 'red' }}
                      >
                        <img
                          src={deleteIcon}
                          style={{ width: '22px', height: '22px' }}
                        />
                      </Link>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <FormControl
                      required
                      className={'gridSecWidth gridmargin'}
                      variant="outlined"
                    >
                      <InputLabel htmlFor="bookgenre">Genre</InputLabel>
                      <Select
                        native
                        value={this.state.genre}
                        onChange={this.onChange}
                        inputProps={{
                          name: 'genre',
                          id: 'bookgenre',
                        }}
                      >
                        <option aria-label="None" value="" />
                        {this.retrieveOptions('genre')}
                      </Select>
                    </FormControl>
                    <div
                      style={{ marginLeft: '15px' }}
                      className={'gridmargin'}
                    >
                      <Link
                        onClick={() => this.openSecDialog('genre')}
                        style={{ color: 'blue' }}
                      >
                        <img
                          src={addIcon}
                          style={{ width: '20px', height: '20px' }}
                        />
                      </Link>
                    </div>
                    <div
                      style={{ marginLeft: '15px' }}
                      className={'gridmargin'}
                    >
                      <Link
                        onClick={() => this.openDeleteDialog('genre')}
                        style={{ color: 'red' }}
                      >
                        <img
                          src={deleteIcon}
                          style={{ width: '22px', height: '22px' }}
                        />
                      </Link>
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      disabled={!this.state.ebookdisabled}
                      required
                      label="Location"
                      variant="outlined"
                      name="location"
                      value={this.state.location}
                      onChange={this.onChange}
                      className={'gridWidth gridmargin'}
                    />
                  </Grid>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <h3 style={{ marginBottom: '20px' }}>Book Cover</h3>
                    <img
                      // alt="book cover"
                      style={{
                        height: '170px',
                        width: '170px',
                        marginBottom: '15px',
                      }}
                      src={this.state.bookimg}
                    />
                    <input
                      required
                      id="uploadField"
                      type="file"
                      onChange={(e) => this.selectImage(e)}
                      style={{ marginBottom: '20px' }}
                    />
                    <TextField
                      required
                      multiline
                      inputProps={{ maxLength: 190 }}
                      label="Summary"
                      variant="outlined"
                      name="summary"
                      value={this.state.summary}
                      onChange={this.onChange}
                      rows={4}
                      className={'gridWidth gridmargin'}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Button
                  style={{ width: '350px', marginTop: '50px' }}
                  variant="outlined"
                  type="submit"
                >
                  Add Book
                </Button>
              </Grid>
            </form>
          </Grid>
        </div>
      </div>
    );
  }
}
