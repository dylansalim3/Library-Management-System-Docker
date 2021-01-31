import React, {Component} from 'react';
import {Card, CardActionArea, CardContent, CardMedia, Grid} from '@material-ui/core';
import BookEditDeleteModal from "./BookEditDeleteModal";
import { BASE_URL } from '../../../constant/route.constant';
import Typography from '@material-ui/core/Typography';
import NoBookImagePlaceholder from "../../../images/book-placeholder.jpg";

class AdminBookSearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookReservationModal:{
                showBookReservationModal:false,
                bookId:null,
            },
        };
    }

    onBookSelected = (selectedBookDetail) => {
        this.props.onBookSelected(selectedBookDetail);
    };

    displaySearchResult = (searchResults) => {
        if (searchResults) {
            return searchResults.map(searchResult => {
                return (
                    <Grid item xs={12} sm={6} md={4} key={searchResult.id}>
                        {this.displayBookDetail(searchResult)}
                    </Grid>
                );
            });
        } else {
            return (
                <p style={{margin: 'auto'}}>No result found</p>
            );
        }
    };

    displayBookDetail = (bookDetail) => {
        const bookId = bookDetail.id;
        const title = bookDetail.title;
        const desc = bookDetail.summary;
        const imageLink = bookDetail.bookimg;
        return (
          <Card style={{ margin: 10 }}>
            <CardContent style={{ padding: 0 }}>
              <CardActionArea onClick={() => this.onBookSelected(bookDetail)}>
                <CardMedia
                  component="img"
                  src={BASE_URL + imageLink}
                  height={200}
                  alt="book img"
                  title={title}
                  onError={(e)=>{e.target.onerror = null; e.target.src=NoBookImagePlaceholder}}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    {title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {desc.length > 100 ? desc.slice(0, 100) + '...' : desc}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </CardContent>
          </Card>
        );
    };

    onChangeShowDetailModal = (data) => {
        this.setState({
            showBookDetailModal: data,
        });
    };


    render() {
        const searchResults = this.props.result;
        return (
            <div id="searchResult">
                <h2>Search Result</h2>
                <Grid container>
                    {this.displaySearchResult(searchResults)}
                </Grid>

            </div>
        );
    }
}

export default AdminBookSearchResult;