import React, {Component} from 'react';
import {Card, CardActionArea, CardContent, CardMedia, Grid} from '@material-ui/core';
import BookDetailModal from "./BookDetailModal";
import BookReservationModal from "./BookReservationModal";
import {BASE_URL} from "../../../constant/route.constant";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";
import {array} from "prop-types";
import NoBookImagePlaceholder from "../../../images/book-placeholder.jpg";

const StyledCardContent = withStyles({
    MuiCardContent: {
        root: {
            padding: 0,
            "&:last-child": {
                paddingBottom: 0,
            },
        },
    },
})(CardContent);

class BookSearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBookDetail: {},
            showBookDetailModal: false,
            bookReservationModal: {
                showBookReservationModal: false,
                bookId: null,
            },
            allBookDetail: {}
        };
    }

    onBookSelected = (selectedBookDetail, allBookDetail) => {
        this.setState({
            selectedBookDetail: selectedBookDetail,
            allBookDetail: allBookDetail,
            showBookDetailModal: true,
        });
    };


    displaySearchResult = (searchResults) => {
        if (searchResults) {

            return Object.keys(searchResults).map(result => {
                //   console.log(searchResults[result][0].id);
                const firstbook = searchResults[result][0];
                const allbook = searchResults[result];
                var jsonBook = [];
                // if (allbook !== undefined && allbook !== null && firstbook !== undefined && typeof allbook === typeof array) {
                    allbook.forEach(book => {
                        jsonBook.push({bookid: book.id, location: book.location});
                    });
                    return (
                        <Grid item xs={12} sm={6} md={4} key={firstbook.id}>
                            {this.displayBookDetail(firstbook, jsonBook)}
                        </Grid>
                    );
                // }

            })

        } else {
// >>>>>>> master
            return (
                <p style={{margin: 'auto'}}>No result found</p>
            );
        }
    };

    displayBookDetail = (bookDetail, allbook) => {
        const bookId = bookDetail.id;
        const title = bookDetail.title;
        const desc = bookDetail.summary;
        let imageLink = bookDetail.bookimg;


        return (
            <Card style={{margin: 10}}>
                <CardContent style={{padding: 0}}>
                    <CardActionArea onClick={() => this.onBookSelected(bookDetail, allbook)}>
                        <CardMedia
                            component="img"
                            src={BASE_URL + imageLink}
                            height={200}
                            alt="book img"
                            title={title}
                            onError={(e)=>{e.target.onerror = null; e.target.src=NoBookImagePlaceholder}}/>

                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h3">
                                {title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {desc.length > 100 ? desc.slice(0, 100) + '...' : desc}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </CardContent>
            </Card>
// <<<<<<< reservation
            
    );
  };

  onChangeShowDetailModal = (data) => {
    this.setState({
      showBookDetailModal: data,
    });
  };

  setSelectedBookId = (bookId) => {
    this.setState({
      bookReservationModal: {
        bookId: bookId,
      },
    });
  };


  onChangeShowBookReservationModal = (show) => {
    this.setState({
      bookReservationModal: {
        showBookReservationModal: show,
      },
    });
  };

  render() {
    const searchResults = this.props.result;
    return (
      <div id="searchResult">
        <h2>{this.props.title}</h2>
        <Grid container>{this.displaySearchResult(searchResults)}</Grid>
        <BookDetailModal
          disabledReservation={this.props.disabledReservation}
          openModal={this.state.showBookDetailModal}
          book={this.state.selectedBookDetail}
          allBook={this.state.allBookDetail}
          reserve={this.props.reserve}
          onChangeShowDetailModal={(e) => {
            this.onChangeShowDetailModal(e);
          }}
          onChangeShowBookReservationModal={(bookId) => {
            this.setSelectedBookId(bookId);
            this.onChangeShowBookReservationModal(true);
          }}
        />
        <BookReservationModal
          openModal={this.state.bookReservationModal.showBookReservationModal}
          book={this.state.bookReservationModal.bookId}
          allBook={this.state.allBookDetail}
          onChangeShowBookReservationModal={() => {
            this.onChangeShowBookReservationModal(false);
          }}
        />
      </div>
    );
  }
// ======= master starts reservation ends
//         );
//     };

//     onChangeShowDetailModal = (data) => {
//         this.setState({
//             showBookDetailModal: data,
//         });
//     };

//     setSelectedBookId = (bookId) => {
//         this.setState({
//             bookReservationModal: {
//                 bookId: bookId,
//             },
//         });
//     };


//     onChangeShowBookReservationModal = (show) => {
//         console.log('here');
//         this.setState({
//             bookReservationModal: {
//                 showBookReservationModal: show,
//             },
//         });
//     };

//     render() {
//         const searchResults = this.props.result;
//         return (
//             <div id="searchResult">
//                 <h2>{this.props.title}</h2>
//                 <Grid container>{this.displaySearchResult(searchResults)}</Grid>
//                 <BookDetailModal
//                     openModal={this.state.showBookDetailModal}
//                     book={this.state.selectedBookDetail}
//                     allBook={this.state.allBookDetail}
//                     onChangeShowDetailModal={(e) => {
//                         this.onChangeShowDetailModal(e);
//                     }}
//                     onChangeShowBookReservationModal={(bookId) => {
//                         this.setSelectedBookId(bookId);
//                         this.onChangeShowBookReservationModal(true);
//                     }}
//                 />
//                 <BookReservationModal
//                     openModal={this.state.bookReservationModal.showBookReservationModal}
//                     book={this.state.bookReservationModal.bookId}
//                     allBook={this.state.allBookDetail}
//                     onChangeShowBookReservationModal={() => {
//                         this.onChangeShowBookReservationModal(false);
//                     }}
//                 />
//             </div>
//         );
//     }
// >>>>>>> master
}

export default BookSearchResult;
