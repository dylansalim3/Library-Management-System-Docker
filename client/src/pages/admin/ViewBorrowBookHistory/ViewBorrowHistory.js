import React, {useState} from 'react';
import AdminBoilerplate from "../AdminBoilerplate";
import EnhancedTable from "../../../components/EnhancedTable";
import {Button, Grid} from "@material-ui/core";
import AutocompleteEmailField from "../AutocompleteEmailField";
import {useSnackbar} from "notistack";
import {useForm} from "react-hook-form";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    title: {
        margin: '20px',
        textAlign: 'center',
    }
}));

const ViewBorrowHistory = () => {
    const classes = useStyles();
    const {register, handleSubmit, watch, setValue, getValues, errors} = useForm();
    const [selectedProfile, setSelectedProfile] = useState();
    const {enqueueSnackbar} = useSnackbar();
    const [borrowBookHistory, setBorrowBookHistory] = useState();

    const submitGetBorrowHistoryForm = () => {
        if (selectedProfile !== undefined) {
            const userId = selectedProfile.id;
            axios.post('borrow-books-history/get-book-history', {
                userId: userId,
            }).then(res => {
                setBorrowBookHistory(res.data);
            }).catch(err => {
                enqueueSnackbar("Error occurred. Please try again later.", {
                    variant: 'error',
                    transitionDuration: 1000
                });
            });
        }
    }

    const headCells = [
        {id: 'title', numeric: false, disablePadding: false, label: 'Message'},
        {id: 'bookId', numeric: false, disablePadding: false, label: 'Book ID'},
        {id: 'bookimg', numeric: false, type: 'img', disablePadding: false, label: 'Book Cover'},
        {id: 'borrowDate', numeric: false, type: 'date', disablePadding: false, label: 'Borrow Date'},
        {id: 'dueDate', numeric: false, type: 'date', disablePadding: false, label: 'Due Date'},
        {id: 'returnDate', numeric: false, type: 'date', disablePadding: false, label: 'Return Date'},
        {id: 'status', numeric: false, disablePadding: false, label: 'Status'},
    ];

    return (
        <div>
            <AdminBoilerplate page={'view-borrow-history'}/>
            <div className="content">
                <h2 className={classes.title}>View Borrow History</h2>
                <form id="borrowHistoryForm" onSubmit={handleSubmit(submitGetBorrowHistoryForm)} noValidate
                      autoComplete="off">
                    <Grid container direction="row" justify="center">
                        <Grid item xs={8} md={8} lg={5} style={{marginTop: 15}}>
                            <AutocompleteEmailField
                                name="email"
                                inputRef={register({required: true})}
                                label="Student Email"
                                onProfileSelected={setSelectedProfile}/>
                        </Grid>
                    </Grid>
                    <div style={{marginTop: 10}} className="flex-justify-center">
                        <Button
                            form="borrowHistoryForm"
                            variant="contained"
                            type="submit"
                            color="primary"
                        >Submit</Button>
                    </div>
                </form>

                {borrowBookHistory ? (borrowBookHistory.length > 0 ? (
                    <EnhancedTable
                        headCells={headCells}
                        rows={borrowBookHistory}
                        disableToolbar/>
                ) : <p className={classes.title}>No Result</p>) : ''}


            </div>
        </div>
    );
};

export default ViewBorrowHistory;