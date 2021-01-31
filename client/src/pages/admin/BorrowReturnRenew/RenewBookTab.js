import React, {useState} from 'react';
import {Button, Grid, TextField} from "@material-ui/core";
import {useForm} from "react-hook-form";
import axios from "axios";
import EnhancedTable from "../../../components/EnhancedTable";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {useSnackbar} from "notistack";
import PendingRenewBookRequest from "./PendingRenewBookRequest";
import CustomModal from "../../../components/CustomModal";
import AutocompleteEmailField from "../AutocompleteEmailField";

const RenewBookTab = () => {
    const [borrowedBooks, setBorrowedBooks] = React.useState([]);

    const [showAlertModal, setShowAlertModal] = React.useState(false);
    const [selectedBorrowBookId, setSelectedBorrowBookId] = React.useState(-1);
    const [expiryDate, setExpiryDate] = React.useState(new Date().now);
    const [selectedProfile, setSelectedProfile] = useState({});


    const {register, handleSubmit, watch, getValues, errors} = useForm();
    const {enqueueSnackbar} = useSnackbar();

    const fetchBorrowBookDetails = () => {
        const data = getValues();
        axios.post('book-request/find-all-borrowed-books-by-email-bookid', data).then(result => {
            setBorrowedBooks(result.data);
        });
    };

    const openDueDateInputModal = (selectedBorrowBookId) => {
        setSelectedBorrowBookId(selectedBorrowBookId);
        setShowAlertModal(true);
    };

    const onSuccessButtonPressed = () => {
        setShowAlertModal(false);
        axios.post("borrow-books/extend-expiry-date",
            {borrowBookId: selectedBorrowBookId, newDueDate: expiryDate}
        ).then(() => {
            fetchBorrowBookDetails();
            enqueueSnackbar('The expiry date has been successfully extended', {
                variant: 'success',
                transitionDuration: 1000
            });
        }).catch(() => {
            enqueueSnackbar('Error occured. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        })
    };

    const resetAlertModal = () => {
        setShowAlertModal(false);
        setExpiryDate(new Date().now);
    };

    const validateForm = () => {
        return (watch('bookId', '').length + watch('email', '').length) > 0 || "Please fill inputs";
    };

    const headCells = [
        {id: 'title', numeric: false, disablePadding: false, label: 'Book Title'},
        {id: 'bookId', numeric: false, disablePadding: false, label: 'Book ID'},
        {id: 'bookimg', numeric: false, type: 'img', disablePadding: false, label: 'Book Cover'},
        {id: 'borrowDate', numeric: false, type: 'date', disablePadding: false, label: 'Borrow Date'},
        {id: 'dueDate', numeric: false, type: 'date', disablePadding: false, label: 'Due Date'},
        {id: 'status', numeric: false, disablePadding: false, label: 'Status'},
    ];


    const InsertDateModalContent = (
        <KeyboardDatePicker
            disablePast
            disableToolbar
            style={{width: '94%'}}
            variant="inline"
            inputVariant="outlined"
            format="dd-MMM-yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Expiry Date"
            name="expiryDate"
            value={expiryDate}
            onChange={(e, value) => setExpiryDate(value)}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
        />
    );

    return (
        <div>
            <form style={{marginBottom:'20px'}}onSubmit={handleSubmit(fetchBorrowBookDetails)} autoComplete="off">
                <Grid container direction="row" justify="center" spacing={3}>
                    <Grid item xs={12} md={5}>
                        <TextField
                            autoFocus
                            label="Book ID"
                            name="bookId"
                            fullWidth
                            error={errors.userId}
                            helperText={errors.userId && errors.userId.message}
                            inputRef={register({validate: validateForm})}
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <AutocompleteEmailField
                            name="email"
                            inputRef={register({validate: validateForm})}
                            label="Student Email"
                            onProfileSelected={setSelectedProfile}/>
                    </Grid>
                    <Grid item xs={2} md={2} style={{display: 'flex', alignItems: 'center'}}>
                        <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                        >Submit</Button>
                    </Grid>
                </Grid>

                {borrowedBooks.length > 0 &&
                <EnhancedTable
                    headCells={headCells}
                    rows={borrowedBooks}
                    actionButtonText="Renew"
                    onDeleteSelection={openDueDateInputModal}
                />
                }
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <CustomModal
                        showAlertModal={showAlertModal}
                        title="Insert Expiry Date to Continue"
                        desc={InsertDateModalContent}
                        onCloseConfirmationModal={resetAlertModal}
                        onSuccessButtonPressed={onSuccessButtonPressed}
                    />
                </MuiPickersUtilsProvider>
            </form>

            <PendingRenewBookRequest/>
        </div>
    );
};

export default RenewBookTab;
