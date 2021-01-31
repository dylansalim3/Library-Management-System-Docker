import React, {useState} from 'react';
import {Button, Grid, TextField} from "@material-ui/core";
import axios from 'axios';
import {useForm} from "react-hook-form";
import {useSnackbar} from "notistack";
import CustomModal from "../../../components/CustomModal";

const ReturnBookTab = () => {
    const [openExpiredModal, setOpenExpiredModal] = useState(false);
    const [expiredModalDesc, setExpiredModalDesc] = useState('');
    const {register, handleSubmit, watch, setValue, getValues, errors} = useForm();
    const {enqueueSnackbar} = useSnackbar();

    const checkIsExpired = () => {
        axios.post('borrow-books-history/is-book-expired', getValues()).then(res => {
            if (res.data) {
                const {fine} = res.data;
                if(fine>0){
                    setOpenExpiredModal(true);
                    setExpiredModalDesc(`The book fine is RM ${fine.toFixed(2)}`);
                }else{
                    submitReturnBookRequest();
                }
            }
        }).catch(err => {
            if (err && err.response?.data?.message) {
                enqueueSnackbar(err.response.data.message, {variant: 'error', transitionDuration: 1000});
            }
        })
    };


    const submitReturnBookRequest = () => {
        axios.post('borrow-books-history/return-book', getValues()).then(res => {
            if (res.data) {
                enqueueSnackbar('Return book request success', {
                    variant: 'success',
                    transitionDuration: 1000
                });
                setValue("bookId", "");
            }
        }).catch(err => {
            if (err && err.response?.data?.message) {
                enqueueSnackbar(err.response.data.message, {variant: 'error', transitionDuration: 1000});
            }
        })
        setOpenExpiredModal(false);
    };

    return (
        <div>
            <form id="returnBookForm" onSubmit={handleSubmit(checkIsExpired)} noValidate autoComplete="off">

                <Grid container direction="row" justify="center">
                    <Grid item md={8} lg={5} style={{marginTop: 15}}>
                        <TextField
                            label="Book ID"
                            name="bookId"
                            fullWidth
                            required
                            variant="outlined"
                            inputRef={register({required: true})}
                            error={errors?.bookId}
                            helperText={errors?.bookId && "Invalid book value"}
                        />
                    </Grid>
                </Grid>
                <div style={{marginTop: 10}} className="flex-justify-center">
                    <Button
                        form="returnBookForm"
                        variant="contained"
                        type="submit"
                        color="primary"
                    >Submit</Button>
                </div>
            </form>
            <CustomModal title="Book is Expired"
                         desc={expiredModalDesc}
                         showAlertModal={openExpiredModal}
                         onSuccessButtonPressed={submitReturnBookRequest}
                         onCloseConfirmationModal={() => setOpenExpiredModal(false)}
            />
        </div>
    );

}

export default ReturnBookTab;