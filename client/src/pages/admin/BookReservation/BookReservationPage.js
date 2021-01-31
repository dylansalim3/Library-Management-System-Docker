import React from 'react';
import AdminBoilerplate from "../AdminBoilerplate";
import {useSnackbar} from "notistack";
import axios from "axios";
import EnhancedTable from "../../../components/EnhancedTable";
import DateFnsUtils from "@date-io/date-fns";
import CustomModal from "../../../components/CustomModal";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {TextField} from "@material-ui/core";
import { BASE_URL } from '../../../constant/route.constant';
import jwt_decode from "jwt-decode";

const RequestType = {
    ACCEPT: 'accept',
    REJECT: 'reject',
};

var today = new Date();
var month,
  day = '';

if (today.getMonth() + 1 < 10) {
  month = '0' + (today.getMonth() + 1);
} else {
  month = today.getMonth() + 1;
}
if (today.getDate() < 10) {
  day = '0' + today.getDate();
} else {
  day = today.getDate();
}

const alphabetmonth = today.toLocaleString('default', { month: 'long' }).substring(0,3);
var todayDate = day + '-' + alphabetmonth + '-' + today.getFullYear(); 
// var todayDate = today.getFullYear() + '-' + month + '-' + day;

const CompletedBookReservation = () => {
    const [bookRequests, setBookRequests] = React.useState([]);
    const {enqueueSnackbar} = useSnackbar();


    React.useEffect(() => {
        retrieveData();
    }, []);

    const headCells = [
      { id: 'bookId', numeric: true, disablePadding: false, label: 'Book ID' },
      {
        id: 'bookimg',
        numeric: false,
        type: 'img',
        disablePadding: false,
        label: 'Book Cover',
      },
      {
        id: 'title',
        numeric: false,
        disablePadding: false,
        label: 'Book Title',
      },
      {
        id: 'requestCreatedDate',
        numeric: false,
        type: 'date',
        disablePadding: false,
        label: 'Request Date',
      },
      { id: 'userId', numeric: true, disablePadding: false, label: 'User ID' },
      {
        id: 'username',
        numeric: false,
        disablePadding: false,
        label: 'Username',
      },
      { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
      { id: 'rejectReason', numeric: false, disablePadding: false, label: 'Reject Reason' },
    ];

    const retrieveData = () => {
        axios.post('book-request/find-all-completed-book-reservations').then(result => {
            result.data.forEach(res=>{
                const img = res.bookimg;
                res.bookimg = img;
            })
            setBookRequests(result.data);
        }).catch(err => {
            enqueueSnackbar('Error occured. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        });
    };

    return (
      <div>
        <h2 style={{ marginTop: '20px',marginBottom: '20px' }}>Completed Book Reservation</h2>
        <EnhancedTable
          headCells={headCells}
          rows={bookRequests}
          disableToolbar
        />
      </div>
    );
};


const BookReservationPage = () => {
    const [bookRequests, setBookRequests] = React.useState([]);
    const {enqueueSnackbar} = useSnackbar();
    const [startDate, setStartDate] = React.useState(new Date().now);
    const [expiryDate, setExpiryDate] = React.useState(new Date().now);
    const [rejectReason, setRejectReason] = React.useState('');
    const [selectedBookRequestId, setSelectedBookRequestId] = React.useState(-1);
    const [showAlertModal, setShowAlertModal] = React.useState(false);
    const [requestType, setRequestType] = React.useState(RequestType.ACCEPT);

    var myUserId = '';

    React.useEffect(() => {
        retrieveData();
    }, []);

    const headCells = [
      { id: 'bookId', numeric: true, disablePadding: false, label: 'Book ID' },
      {
        id: 'bookimg',
        numeric: false,
        type: 'img',
        disablePadding: false,
        label: 'Book Cover',
      },
      {
        id: 'title',
        numeric: false,
        disablePadding: false,
        label: 'Book Title',
      },
      {
        id: 'requestCreatedDate',
        numeric: false,
        type: 'date',
        disablePadding: false,
        label: 'Request Date',
      },
      { id: 'userId', numeric: true, disablePadding: false, label: 'User ID' },
      {
        id: 'username',
        numeric: false,
        disablePadding: false,
        label: 'Username',
      },
      {
        id: 'requestReason',
        numeric: false,
        disablePadding: false,
        label: 'Reason',
      },
      {
        id: 'desiredEndDate',
        numeric: false,
        disablePadding: false,
        label: 'Desired end date',
      },
    ];

    const retrieveData = () => {
        axios.post('book-request/find-all-pending-book-reservations').then(async result => {
          
          await result.data.forEach(result=>{
            result['desiredEndDate']=result['requestReason'].substring(0,10);
            result['requestReason'] = result['requestReason'].substring(10);
          })
          setBookRequests(result.data);

        }).catch(err => {
            console.log(err);
            enqueueSnackbar('Error occured. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        });
    };

    const acceptBookReservationRequest = (bookRequestId) => {
        setSelectedBookRequestId(bookRequestId);
        setRequestType(RequestType.ACCEPT);
        setShowAlertModal(true);
    };

    const rejectBookReservationRequest = (bookRequestId) => {
        setSelectedBookRequestId(bookRequestId);
        setRequestType(RequestType.REJECT);
        setShowAlertModal(true);
    };

    const resetAlertModal = () => {
        setShowAlertModal(false);
        setExpiryDate(new Date().now);
        setRejectReason('');
    };


    const InsertDateModalContent = (
        <div>
            <KeyboardDatePicker
                disabled={true}
                disablePast
                disableToolbar
                style={{width: '94%'}}
                variant="inline"
                inputVariant="outlined"
                format="dd-MMM-yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Start Date"
                name="startDate"
                value={startDate}
                onChange={(e, value) => setStartDate(value)}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            />
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
        </div>
    );

    const InsertRejectReasonModalContent = (
      <TextField
        required
        multiline
        rows={4}
        autoFocus
        label="Reject Reason"
        name="rejectReason"
        value={rejectReason}
        fullWidth
        variant="outlined"
        onChange={(e) => setRejectReason(e.target.value)}
      />
    );

    const onSuccessButtonPressed = async () => {
        try {
            if (requestType === RequestType.ACCEPT) {
                await axios
                  .post('book-request/accept-book-reservation-request', {
                    bookRequestId: selectedBookRequestId,
                    startDate: todayDate,
                    dueDate: expiryDate,
                  })
                  .then((result) => {
                    enqueueSnackbar('The book reservation has been approved', {
                      variant: 'success',
                      transitionDuration: 1000,
                    });
                    resetAlertModal();
                    retrieveData();
                    // window.location.reload(false);
                    return result;
                  });
            } else {
                if(rejectReason){
                    await axios.post('book-request/reject-book-reservation-request', {
                        bookRequestId: selectedBookRequestId,
                        rejectReason
                    }).then(async result => {
                        enqueueSnackbar('The book reservation has been rejected', {
                            variant: 'success',
                            transitionDuration: 1000
                        });
                                resetAlertModal();
                                retrieveData();
                                window.location.reload(false);
                        return result;
                    })
                }else{
                    enqueueSnackbar(
                        'Field cannot be empty.',
                        {
                        variant: 'error',
                        transitionDuration: 1000,
                        }
                    );
                }
            }
        } catch (err) {
            console.log(err);
            enqueueSnackbar('Error occured. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        }
        // resetAlertModal();
        // retrieveData();
        // window.location.reload(false);
    };

    const actionAreaHeadCells = [
        {
            id: 'accept',
            disablePadding: false,
            label: 'Accept',
            text: 'Accept',
            color: 'success',
            disable: {id: 'status', criteria: 'ne', value: 'PROCESSING'},
            action: acceptBookReservationRequest
        },
        {
            id: 'reject',
            disablePadding: false,
            label: 'Reject',
            text: 'Reject',
            color: 'secondary',
            disable: {id: 'status', criteria: 'ne', value: 'PROCESSING'},
            action: rejectBookReservationRequest
        },
    ];

    return (
      <div>
        <AdminBoilerplate page={'reservebook'} />
        <div className="content">
          <h2 style={{ marginBottom: '20px' }}>Pending Book Reservation</h2>
          <EnhancedTable
            headCells={headCells}
            rows={bookRequests}
            disableToolbar
            actionAreaHeadCells={actionAreaHeadCells}
          />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <CustomModal
              showAlertModal={showAlertModal}
              title={
                requestType === RequestType.ACCEPT
                  ? 'Insert Reservation End Date to Continue'
                  : 'Please enter reason for rejection.'
              }
              desc={
                requestType === RequestType.ACCEPT
                  ? InsertDateModalContent
                  : InsertRejectReasonModalContent
              }
              onCloseConfirmationModal={resetAlertModal}
              onSuccessButtonPressed={onSuccessButtonPressed}
            />
          </MuiPickersUtilsProvider>

          <CompletedBookReservation />
        </div>
      </div>
    );
};

export default BookReservationPage;