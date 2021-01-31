import React, {Component} from 'react';
import {
    Dialog,
    Button,
    DialogContent,
    Grid,
    DialogTitle,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {formatDate} from "../../../util/DateUtils";
import BookReservationModal from './BookReservationModal';
import { BASE_URL } from '../../../constant/route.constant';

import axios from 'axios';
import { Fragment } from 'react';
import NoBookImagePlaceholder from "../../../images/book-placeholder.jpg";

class BookDetailModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reservationModal: false,
      selectedbook: null,
      disabledReserve: true,
    };
  }
  onCloseModal = () => {
    this.props.onChangeShowDetailModal(false);
  };

  onReserveBook = (bookId) => {
    this.setState({
      reservationModal: true,
      selectedbook: bookId,
    });
    // this.props.onChangeShowBookReservationModal(true);
  };


  returnTable = (books) =>{

    return (
      <TableContainer style={{ marginTop: '20px' }} component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Book ID</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.bookid}>
                <TableCell align="center" component="th" scope="row">
                  {book.bookid}
                </TableCell>
                <TableCell align="center">{book.location}</TableCell>
                <TableCell align="center">
                  <Button
                    disabled={this.props.disabledReservation}
                    variant="contained"
                    color="primary"
                    onClick={() => this.onReserveBook(book.bookid)}
                  >
                    RESERVE
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  returnBook = () => {

    // console.log(this.props.disabledReservation);
    if (this.props.book.type !== 'digital') {
      if (this.props.reserve) {
        if (this.props.allBook) {
          var arr = [];
          var allBook = this.props.allBook;
          for (var i in allBook) {
            arr.push(allBook[i]);
          }
          if (arr.length == 1) {
            var location = null;
            var singleId = null;
            for (var i in arr) {
              location = arr[i].location;
              singleId = arr[i].bookid;
            }
            return this.returnTable(arr);
            // return (
            //   <p
            //     style={{
            //       display: 'flex',
            //       justifyContent: 'space-between',
            //     }}
            //   >
            //     <span>Location</span>
            //     <span>{location}</span>
            //     <Button
            //       disabled={this.props.disabledReservation}
            //       variant="contained"
            //       color="primary"
            //       onClick={() => this.onReserveBook(singleId)}
            //     >
            //       RESERVE
            //     </Button>
            //   </p>
            // );
          } else {
            return this.returnTable(arr);
            // return arr.map((book) => {
            //   // const bookStatus = book.status==='available'?false:true;
            //   // console.log(book.status);
            //   return (
            //     <div>
            //       <p>
            //         {book.bookid}: {book.location}
            //       </p>
            //       <Button
            //         disabled={this.props.disabledReservation}
            //         variant="contained"
            //         color="primary"
            //         onClick={() => this.onReserveBook(book.bookid)}
            //       >
            //         RESERVE
            //       </Button>
            //     </div>
            //   );
            // });
          }
        } else {
          var location = this.props.book.location;
          var id = this.props.book.id;
          var myJSONObject ={"location":location,"bookid":id}
          var jsonArr=[myJSONObject];
          return this.returnTable(jsonArr);
          // return (
          //   <p
          //     style={{
          //       display: 'flex',
          //       justifyContent: 'space-between',
          //     }}
          //   >
          //     <span>Location </span>
          //     <span>{this.props.book.location}</span>
          //     <Button
          //       disabled={this.props.disabledReservation}
          //       variant="contained"
          //       color="primary"
          //       onClick={() => this.onReserveBook(this.props.book.id)}
          //     >
          //       RESERVE
          //     </Button>
          //   </p>
          // );
        }
      }else{
        return (
          <p
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h4>Location</h4>
            <span>
              {this.props.book.location ? this.props.book.location : '-'}
            </span>
          </p>
        );
      }
    } else {
      return null;
    }
  };

  render() {
    const columns = [
      {
        id: 'No',
        label: 'No',
        minWidth: 50,
        format: (value) => value.toLocaleString('en-US'),
      },
      {
        id: 'Book ID',
        label: 'Book ID',
        minWidth: 150,
        format: (value) => value.toLocaleString('en-US'),
      },
      {
        id: 'location',
        label: 'Location',
        minWidth: 170,
      },
      {
        id: 'Reserve',
        label: 'Reserve',
        minWidth: 170,
      },
    ];
    const location = this.props.book.location;
    const desc = this.props.book.summary;
    const genre = this.props.book.genre;
    const books = this.props.book.books;
    const authors = this.props.book.author;
    const datepublished = this.props.book.datepublished;
    const publisher = this.props.book.publisher;
    const category = this.props.book.category;
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
            <div style={{ padding: 10 }}>
              <Grid container spacing={1}>
                <Grid item md={4} xs={12}>
                  <img
                    style={{ height: 128, width: 128 }}
                    src={BASE_URL + this.props.book.bookimg}
                    alt="book_img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = NoBookImagePlaceholder;
                    }}
                  />
                </Grid>
                <Grid item md={8} xs={12}>
                  <p
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h4>Title</h4>
                    <p>{this.props.book.title}</p>
                  </p>
                  <p
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h4>ISBN</h4>
                    <span>{this.props.book.isbn}</span>
                  </p>
                  <p
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h4>Type</h4>
                    <span>{this.props.book.type}</span>
                  </p>
                  <p
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h4>Category</h4>
                    <span>{category ? category.name : '-'}</span>
                  </p>
                  <p
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h4>Genre</h4>
                    <span>{genre ? genre.name : '-'}</span>
                  </p>
                  <Grid container>
                    <Grid item xs={4}>
                      <h4>Description</h4>
                    </Grid>
                    <Grid item xs={8}>
                      <span
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          textOverflow: 'scale',
                        }}
                      >
                        {desc ? desc : '-'}
                      </span>
                    </Grid>
                  </Grid>
                  <p
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h4>Author</h4>
                    <span>{authors ? authors : '-'}</span>
                  </p>
                  <p
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h4>Date Published</h4>
                    <span>
                      {datepublished ? formatDate(datepublished) : '-'}
                    </span>
                  </p>
                  <p
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <h4>Publisher</h4>
                    <span>{publisher ? publisher : '-'}</span>
                  </p>
                  {this.returnBook()}
                </Grid>
              </Grid>
              {this.props.book.type === 'digital' ? (
                <div
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}
                >
                  <a
                    href={
                      process.env.REACT_APP_SERVER_BASE_URL +
                      this.props.book.e_book
                    }
                    without
                    rel="noopener noreferrer"
                    target="_blank"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="contained" color="primary">
                      View e-book
                    </Button>
                  </a>
                </div>
              ) : null}
            </div>
          </DialogContent>
        </Dialog>
        <BookReservationModal
          openModal={this.state.reservationModal}
          selectedbook={this.state.selectedbook}
          onChangeShowBookReservationModal={() => {
            this.setState({
              reservationModal: false,
            });
          }}
        />
      </div>
    );
  }
}

export default BookDetailModal;