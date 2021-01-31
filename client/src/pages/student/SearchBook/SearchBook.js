import React, {Component} from 'react';
import StudentBoilerplate from '../StudentBoilerplate';
import FormControl from '@material-ui/core/FormControl';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Box, Button, Grid, InputLabel, MenuItem, OutlinedInput, Select} from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import BookSearchResult from './BookSearchResult';
import BookRecommendation from "../../../components/BookRecommendation";
import NewArrivalBook from "../../../components/NewArrivalBook";
import LatestBookResult from './LatestBookResult';
const _ = require('underscore');


class SearchBook extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchCriteria: '',
      searchCriteriaType: 'title',
      genreList: [],
      genre: '',
      showBookSearchResult: false,
      bookSearchResult: [],
      disabledReservation: false,
    };
  }

  componentDidMount() {
    const genreList = axios.get('genres/get-all-genre');
    const latestBook = axios.get('book-details/get-latest-book');
    axios.all([genreList, latestBook]).then(([genreListRes, latestBookRes]) => {
      this.setState({
        genreList: genreListRes.data,
        latestBooks: latestBookRes.data,
      });
    });
    this.getSetting();
  }

  getSetting = () => {
    axios.get('/setting/retrieve').then((res) => {
      const returned = res.data.result;

      this.setState({
        disabledReservation: returned.reservation_function == 0 ? true : false,
      });
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeGenre = (e, value) => {
    this.setState({
      genre: value,
    });
  };

  resetForm = () => {
    this.setState({
      searchCriteria: '',
      searchCriteriaType: 'title',
      genre: '',
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.getBookResults();
  };

  getBookResults = () => {
    axios
      .post('book-details/get-book', {
        searchCriteria: this.state.searchCriteria,
        searchCriteriaType: this.state.searchCriteriaType,
        genre: this.state.genre,
      })
      .then((results) => {
        const Array = results.data;
        const Property = 'isbn';
        const booksByISBN = _.groupBy(Array, Property);
        this.setState({
          showBookSearchResult: true,
          // bookSearchResult: results.data,
          bookSearchResult: booksByISBN,
        });
        // console.log(this.state.showBookSearchResult);
      });
  };

  displayGenre = () => {
    const genreList = this.state.genreList;
    return (
      <div>
        <h2 style={{marginBottom:'10px'}}>Genre</h2>
        <ToggleButtonGroup
          value={this.state.genre}
          exclusive
          onChange={this.onChangeGenre}
          name="genre"
          aria-label="genre"
        >
          {genreList.map((genre) => {
            return (
              <ToggleButton key={genre.id} value={genre.id}>
                {genre.name}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </div>
    );
  };

  displaySearchCriteria = () => {
    const searchCriteriaType = this.state.searchCriteriaType;
    const onChange = this.onChange;
    return (
      <FormControl variant="outlined" fullWidth>
        <InputLabel htmlFor="book-title">
          {'Book ' + searchCriteriaType}
        </InputLabel>
        <OutlinedInput
          autoFocus
          id="book-title"
          name={searchCriteriaType}
          label={'Book ' + searchCriteriaType}
          type="text"
          name={'searchCriteria'}
          placeholder={'Book ' + searchCriteriaType + ' Here'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          }
          labelWidth={60}
          onChange={onChange}
          value={this.state.searchCriteria}
        ></OutlinedInput>
      </FormControl>
    );
  };

  displaySearchCriteriaType = () => {
    //ref error here
    return (
      <FormControl variant="outlined" fullWidth>
        <Select
          name="searchCriteriaType"
          value={this.state.searchCriteriaType}
          onChange={this.onChange}
        >
          <MenuItem key={'Title'} value={'title'}>
            Title
          </MenuItem>
          <MenuItem key={'ISBN'} value={'isbn'}>
            ISBN
          </MenuItem>
          <MenuItem key={'Publisher'} value={'publisher'}>
            Publisher
          </MenuItem>
          <MenuItem key={'Author'} value={'author'}>
            Author
          </MenuItem>
        </Select>
      </FormControl>
    );
  };

  render() {
    return (
      <div>
        <StudentBoilerplate page={'searchbook'} />
        <div className="content">
          <h2>Library Catalog</h2>
          <Card style={{ padding: 10, marginBottom: '20px',marginTop:'15px' }}>
            <CardContent className="flexGrow">
              <form onSubmit={this.onSubmit} noValidate autoComplete="off">
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    {this.displaySearchCriteria()}
                  </Grid>
                  <Grid item xs={4} style={{ marginBottom: '20px' }}>
                    {this.displaySearchCriteriaType()}
                  </Grid>
                </Grid>
                {this.displayGenre()}
                <Box component="div" mt={2}>
                  <Box component="div" display="inline">
                    <Button variant="contained" type="submit" color="primary">
                      Search
                    </Button>
                  </Box>
                  <Box component="div" display="inline" ml={1}>
                    <Button
                      variant="contained"
                      onClick={this.resetForm}
                      color="secondary"
                    >
                      Reset
                    </Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
          {this.state.showBookSearchResult ? (
            <div style={{ marginTop: '30px', marginBottom: '30px' }}>
              <BookSearchResult
                disabledReservation={this.state.disabledReservation}
                reserve={true}
                title="Search Result"
                result={this.state.bookSearchResult}
              />
            </div>
          ) : (
            ''
          )}
          <div style={{marginBottom:'20px'}}>
            <NewArrivalBook
              disabledReservation={this.state.disabledReservation}
              reserve={true}
            />
          </div>
          <BookRecommendation
            disabledReservation={this.state.disabledReservation}
            reserve={true}
          />
        </div>
      </div>
    );
  }
}

export default SearchBook;