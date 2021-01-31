import React, {useState} from 'react';
import {Button, Grid, TextField} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {KeyboardDatePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';
import axios from 'axios';
import {useForm} from "react-hook-form";
import AutocompleteEmailField from "../AutocompleteEmailField";
import {useSnackbar} from "notistack";

const BorrowBookTab = () => {
    const {register, handleSubmit, watch, setValue, getValues, errors} = useForm();
    const [endDate, setEndDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [selectedProfile, setSelectedProfile] = useState({});
    const {enqueueSnackbar} = useSnackbar();


    const submitBorrowRequest = () => {
        const {bookId, email} = getValues();
        axios.post('borrow-books/add-borrow-book', {bookId, email, startDate, endDate}).then(res => {
            if (res.data) {
                // show success msg
                enqueueSnackbar('Borrow book request success', {
                    variant: 'success',
                    transitionDuration: 1000
                });
                setValue("bookId",'');
                setValue('email','');
                setStartDate(null);
                setEndDate(null);
            }
        })
            .catch(err => {
                if (err && err.response?.data?.message) {
                    enqueueSnackbar(err.response.data.message, {variant: 'error', transitionDuration: 1000});
                }
            });
    };

    return (
        <div>
            <form id="borrowBookForm" onSubmit={handleSubmit(submitBorrowRequest)} noValidate autoComplete="off">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>

                    <Grid container direction="row" justify="center">
                        <Grid item xs={8} md={8} lg={5}>
                            <TextField
                                autoFocus
                                label="Book ID"
                                name="bookId"
                                type="number"
                                inputRef={register({required: true})}
                                error={errors?.bookId}
                                helperText={errors?.bookId && "Invalid book value"}
                                fullWidth
                                required
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justify="center">
                        <Grid item xs={8} md={8} lg={5} style={{marginTop: 15}}>
                            <AutocompleteEmailField
                                name="email"
                                inputRef={register({required: true})}
                                label="Student Email"
                                onProfileSelected={setSelectedProfile}/>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justify="center">

                        <Grid item xs={8} md={8} lg={5}>
                            <KeyboardDatePicker
                                maxDate={endDate ? new Date(new Date(endDate).getTime() - 1000 * 60 * 60 * 24) : null}
                                disablePast
                                disableToolbar
                                variant="inline"
                                inputVariant="outlined"
                                format="dd-MM-yyyy"
                                fullWidth
                                margin="normal"
                                id="date-picker-inline"
                                label="Start Date"
                                name="startDate"
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                required
                                value={startDate}
                                onChange={(e, value) => setStartDate(e)}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" justify="center">
                        <Grid item xs={8} md={8} lg={5}>
                            <KeyboardDatePicker
                                minDate={new Date(new Date(startDate).getTime() + 1000 * 60 * 60 * 24)}
                                disablePast
                                disableToolbar
                                variant="inline"
                                inputVariant="outlined"
                                format="dd-MM-yyyy"
                                fullWidth
                                margin="normal"
                                id="date-picker-inline"
                                label="End Date"
                                name="endDate"
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                required
                                value={endDate}
                                onChange={(e, value) => setEndDate(e)}
                            />
                        </Grid>
                    </Grid>
                    <div style={{marginTop: 10}} className="flex-justify-center">
                        <Button
                            form="borrowBookForm"
                            variant="contained"
                            type="submit"
                            color="primary"
                        >Submit</Button>
                    </div>
                </MuiPickersUtilsProvider>
            </form>
        </div>
    );
}

export default BorrowBookTab;