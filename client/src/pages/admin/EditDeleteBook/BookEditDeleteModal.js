import React, {Component} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid} from '@material-ui/core';
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from 'axios';
import MenuItem from "@material-ui/core/MenuItem";
import AlertDialog from "../../../components/AlertDialog";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import * as html2canvas from 'html2canvas';
import { BASE_URL } from '../../../constant/route.constant';
import NoBookImagePlaceholder from "../../../images/book-placeholder.jpg";

var Barcode = require('react-barcode');

const DarkerDisabledTextField = withStyles({
    root: {
        '& .MuiInputBase-root.Mui-disabled': {
            color: 'rgba(0, 0, 0, 0.6)', // (default alpha is 0.38)
        },
    },
})(TextField);

const initialState = {
    editing: false,
}

class BookEditDeleteModal extends Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, initialState);
  }

  onCloseModal = () => {
    this.setState({
      displayimg: null,
      ebook: null,
    });
    this.onCloseConfirmationModal();
    this.props.onChangeShowDetailModal(false);
  };

  onChange = (e) => {
    var bookDetail = Object.assign({}, this.props.book);
    bookDetail = {
      ...bookDetail,
      [e.target.name]: e.target.value,
    };
    this.props.onEditBookDetail(bookDetail);
  };

  onChangeDate = (name, value) => {
    var bookDetail = Object.assign({}, this.props.book);
    bookDetail = {
      ...bookDetail,
      [name]: value,
    };
    this.props.onEditBookDetail(bookDetail);
  };

  selectImage = (e) => {
    var bookDetail = Object.assign({}, this.props.book);
    bookDetail = {
      ...bookDetail,
      uploadbookimg: e.target.files[0],
      bookimg: URL.createObjectURL(e.target.files[0]),
      // displayimg: URL.createObjectURL(e.target.files[0]),
      imgchanged: true,
    };
    this.props.onEditBookDetail(bookDetail);
    this.setState({
      displayimg: URL.createObjectURL(e.target.files[0]),
    });
  };

  uploadImage = async () => {
    if (this.props.book.imgchanged) {
      let imageFormObj = new FormData();
      imageFormObj.append('file', this.props.book.uploadbookimg);

      await axios
        .post('/file', imageFormObj)
        .then((data) => {
          var bookDetail = Object.assign({}, this.props.book);
          bookDetail = {
            ...bookDetail,
            bookimgpath: data.data,
          };
          this.props.onEditBookDetail(bookDetail);
          return data.data;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    } else {
      console.log('book pic is not changed');
    }
  };

  uploadEbook = async () => {
    console.log(this.state.ebook);
    if (this.state.ebook) {
      
      let ebookFormObj = new FormData();
      ebookFormObj.append('file', this.state.ebook);

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
      console.log('ebook is not changed');
    }
  };

  updateBookDetail = async () => {
    //upload img if changed
    await this.uploadImage();
    await this.uploadEbook();
    console.log(this.state.ebookpath);
    //update user profile
    let uploadbookimgpath;
    if (this.props.book.imgchanged) {
      uploadbookimgpath = this.props.book.bookimgpath;
    } else {
      uploadbookimgpath = this.props.book.bookimg;
    }
    if(this.state.ebook){
        axios
          .post('book-details/update-book', {
            id: this.props.book.id,
            title: this.props.book.title,
            isbn: this.props.book.isbn,
            genreId: this.props.book.genre_id,
            bookimg: uploadbookimgpath,
            summary: this.props.book.summary,
            author: this.props.book.author,
            datepublished: this.props.book.datepublished,
            publisher: this.props.book.publisher,
            location: this.props.book.location,
            ebook: this.state.ebookpath,
          })
          .then((res) => {
            this.props.onUpdateBook();
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        this.setState({
          editing: false,
          dialog: true,
        });
    }else{
              axios
                .post('book-details/update-book', {
                  id: this.props.book.id,
                  title: this.props.book.title,
                  isbn: this.props.book.isbn,
                  genreId: this.props.book.genre_id,
                  bookimg: uploadbookimgpath,
                  summary: this.props.book.summary,
                  author: this.props.book.author,
                  datepublished: this.props.book.datepublished,
                  publisher: this.props.book.publisher,
                  location: this.props.book.location,

                })
                .then((res) => {
                  this.props.onUpdateBook();
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });

              this.setState({
                editing: false,
                dialog: true,
              });
    }
  };

  deleteBookDetail = () => {
    axios
      .post('book-details/delete-book', {
        id: this.props.book.id,
      })
      .then((res) => {
        this.props.onUpdateBook();
        this.onCloseModal();
      });
  };

  onCloseConfirmationModal = () => {
    this.setState({
      showAlertModal: false,
    });
  };

  downloadBarcodeImg = () => {
    var a = document.createElement('a');
    const fileName = String(this.props.book.id) + '.png';
    a.setAttribute('download', fileName);
    a.setAttribute('href', BASE_URL + this.props.book.barcode_path);
    a.setAttribute('target', BASE_URL + '_blank');
    a.click();
  };

  downloadBarcode = () => {
    var input = document.getElementById('barcodeField');
    html2canvas(input)
      .then((canvas) => {
        // var img = canvas;
        const imgData = canvas.toDataURL('image/png');
        var a = document.createElement('a');
        const fileName = String(this.props.book.id) + '.png';
        a.setAttribute('download', fileName);
        a.setAttribute('href', imgData);
        a.click();
      })
      .catch((e) => console.log(e));
  };

  selectEbook = (e) => {
    this.setState({
      ebook: e.target.files[0],
    });
    console.log(this.state.ebook);
  };

  render() {
    const book = this.props.book;
    if (book) {
      return (
        <div>
          <Dialog
            open={this.props.openModal}
            onClose={() => this.onCloseModal()}
            scroll="body"
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            fullWidth
          >
            <DialogTitle id="scroll-dialog-title" className="textCenter">
              {this.props.book.title}
            </DialogTitle>
            <DialogContent dividers>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div style={{ padding: 10 }}>
                  <Grid container spacing={1}>
                    <Grid
                      item
                      xs={12}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Button
                        disabled={!this.state.editing}
                        onClick={() => this.refs.fileUploader.click()}
                        className="flex-justify-center"
                      >
                        <img
                          style={{ height: 128, width: 128 }}
                          // src={BASE_URL + book.bookimg}
                          src={
                            this.state.displayimg == null
                              ? BASE_URL + book.bookimg
                              : this.state.displayimg
                          }
                          alt="book_img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = NoBookImagePlaceholder;
                          }}
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
                        fullWidth
                        disabled
                        label="Book Id"
                        variant="outlined"
                        name="bookId"
                        value={book.id}
                        //   onChange={this.onChange}
                        className="profileInput gridmargin"
                      />
                      <DarkerDisabledTextField
                        fullWidth
                        disabled={!this.state.editing}
                        label="Title"
                        variant="outlined"
                        name="title"
                        value={book.title}
                        onChange={this.onChange}
                        className="profileInput gridmargin"
                      />
                      <DarkerDisabledTextField
                        fullWidth
                        disabled={!this.state.editing}
                        label="ISBN"
                        variant="outlined"
                        name="isbn"
                        value={book.isbn}
                        onChange={this.onChange}
                        className="profileInput gridmargin"
                      />
                      <DarkerDisabledTextField
                        fullWidth
                        select
                        disabled={!this.state.editing}
                        label="Genre"
                        variant="outlined"
                        name="genre_id"
                        value={book.genre_id}
                        onChange={this.onChange}
                        className="profileInput gridmargin"
                      >
                        {this.props.genreList ? (
                          this.props.genreList.map((genre) => (
                            <MenuItem key={genre.id} value={genre.id}>
                              {genre.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem>{null}</MenuItem>
                        )}
                      </DarkerDisabledTextField>
                      <div style={{alignSelf:'start',marginLeft:'20px',marginTop:'20px'}}>
                        <h3
                          style={{ marginBottom: '10px' }}
                        >
                          Select and upload Ebook
                        </h3>
                        <input
                          disabled={
                            book.type == 'physical' || !this.state.editing
                          }
                          type="file"
                          onChange={(e) => this.selectEbook(e)}
                        />
                      </div>

                      <DarkerDisabledTextField
                        fullWidth
                        disabled={!this.state.editing}
                        label="Description"
                        variant="outlined"
                        name="summary"
                        value={book.summary}
                        onChange={this.onChange}
                        multiline
                        row={4}
                        className="profileInput gridmargin"
                      />
                      <DarkerDisabledTextField
                        fullWidth
                        disabled={!this.state.editing}
                        label="Author"
                        variant="outlined"
                        name="author"
                        value={book.author}
                        onChange={this.onChange}
                        className="profileInput gridmargin"
                      />
                      <KeyboardDatePicker
                        disableFuture
                        disableToolbar
                        disabled={!this.state.editing}
                        style={{ width: '94%' }}
                        variant="inline"
                        inputVariant="outlined"
                        format="dd-MM-yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Published Date"
                        name="datepublished"
                        value={book.datepublished}
                        onChange={(e, value) =>
                          this.onChangeDate('datepublished', e)
                        }
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                      <DarkerDisabledTextField
                        fullWidth
                        disabled={!this.state.editing}
                        label="Publisher"
                        variant="outlined"
                        name="publisher"
                        value={book.publisher}
                        onChange={this.onChange}
                        className="profileInput gridmargin"
                      />
                      <DarkerDisabledTextField
                        fullWidth
                        disabled={book.type == 'digital' || !this.state.editing}
                        label="Location"
                        variant="outlined"
                        name="location"
                        value={book.location}
                        onChange={this.onChange}
                        className="profileInput gridmargin"
                        style={{ marginBottom: '30px' }}
                      />
                      <div
                        id="barcodeField"
                        style={{
                          width: '150px',
                          height: '150px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Barcode
                          id="barcode"
                          style={{
                            width: '100%',
                            backgroundColor: 'red',
                          }}
                          value={String(book.id)}
                        />
                      </div>
                      {/* <Button
                        variant="contained"
                        onClick={this.downloadBarcode}
                        style={{
                          backgroundColor: '#1f84ff',
                          height: '40px',
                          width: '100%',
                          marginTop: '30px',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        Redownload barcode
                      </Button> */}
                      <Button
                        variant="contained"
                        onClick={this.downloadBarcodeImg}
                        style={{
                          backgroundColor: '#1f84ff',
                          height: '40px',
                          width: '100%',
                          marginTop: '30px',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        View Barcode
                      </Button>
                    </Grid>
                  </Grid>
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
                      style={{
                        width: '40%',
                        maxWidth: '230px',
                        height: '40px',
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      disabled={!this.state.editing}
                      variant="contained"
                      onClick={() => this.updateBookDetail()}
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
                    <Button
                      disabled={this.state.editing}
                      variant="contained"
                      onClick={() => this.setState({ showAlertModal: true })}
                      style={{
                        backgroundColor: '#FF0000',
                        marginLeft: '20px',
                        width: '40%',
                        maxWidth: '230px',
                        height: '40px',
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </MuiPickersUtilsProvider>
            </DialogContent>
          </Dialog>

          <Dialog
            open={this.state.showAlertModal}
            onClose={this.onCloseConfirmationModal}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle>Are you sure you want to delete the book?</DialogTitle>
            <DialogContent>
              Once the book is deleted. The operation cannot be undone
            </DialogContent>
            <DialogActions>
              <Button onClick={this.onCloseConfirmationModal} color="primary">
                Cancel
              </Button>
              <Button
                onClick={() => this.deleteBookDetail()}
                color="primary"
                autoFocus
              >
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
    return <div></div>;
  }
}

export default BookEditDeleteModal;