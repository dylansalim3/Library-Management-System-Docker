import React from 'react';
import axios from "axios";
import {useSnackbar} from "notistack";
import EnhancedTable from "../../../components/EnhancedTable";
import CustomModal from "../../../components/CustomModal";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {TextField} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import {BORROW_HISTORY} from "../../../constant/route.constant";
import {Check, Delete} from "@material-ui/icons";

const RequestType = {
    ACCEPT: 'accept',
    REJECT: 'reject',
};

const CompletedRenewBookRequest = () => {
    const [bookRequests, setBookRequests] = React.useState([]);
    const {enqueueSnackbar} = useSnackbar();

    const retrieveData = () => {
        axios.post("book-request/find-all-extend-book-requests").then(async result => {
                if(result.data.completedBookRequests){
                    await result.data.completedBookRequests.forEach((result) => {
                    result['desiredEndDate'] = result['reason'].substring( 0, 10 );
                    result['reason'] = result['reason'].substring(10);
                });
            }
            setBookRequests(result.data?.completedBookRequests);
        }).catch(err => {
            enqueueSnackbar('Error occured. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        });
    };

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
        label: 'Created Date',
      },
      { id: 'userId', numeric: true, disablePadding: false, label: 'User ID' },
      {
        id: 'username',
        numeric: false,
        disablePadding: false,
        label: 'Username',
      },
      // {id: 'startDate', numeric: false, type: 'date', disablePadding: false, label: 'Start Date'},
      {
        id: 'dueDate',
        numeric: false,
        type: 'date',
        disablePadding: false,
        label: 'Due Date',
      },
      {
        id: 'desiredEndDate',
        numeric: false,
        disablePadding: false,
        label: 'Desired End Date',
      },
      { id: 'reason', numeric: false, disablePadding: false, label: 'Reason' },
      {
        id: 'rejectReason',
        numeric: false,
        disablePadding: false,
        label: 'Reject Reason',
      },
      { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    ];

    const searchCriteria = ['title', 'username'];

    return (
        <div>
            <h2 style={{ marginBottom: '10px' }}>Completed Renew Book Request</h2>
            <EnhancedTable
                headCells={headCells}
                rows={bookRequests}
                searchCriteria={searchCriteria}
            />
        </div>
    )
};

const PendingRenewBookRequest = () => {
    const [bookRequests, setBookRequests] = React.useState([]);
    const [showAlertModal, setShowAlertModal] = React.useState(false);
    const [requestType, setRequestType] = React.useState(RequestType.ACCEPT);
    const [selectedBookRequestId, setSelectedBookRequestId] = React.useState(-1);
    const [rejectReason, setRejectReason] = React.useState('');
    const [expiryDate, setExpiryDate] = React.useState(new Date().now);
    const {enqueueSnackbar} = useSnackbar();

    const retrieveData = () => {
        axios.post("book-request/find-all-extend-book-requests").then(async result => {
            if(result.data.pendingBookRequests){
                await result.data.pendingBookRequests.forEach((result) => {
                  result['desiredEndDate'] = result['reason'].substring( 0, 10 );
                  result['reason'] = result['reason'].substring(10);
                });
            }
            setBookRequests(result.data?.pendingBookRequests);
        }).catch(err => {
            enqueueSnackbar('Error occured. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        });
    };

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

    const InsertRejectReasonModalContent = (
        <TextField
            multiline
            rows={4}
            autoFocus
            label="Reject Reason"
            name="rejectReason"
            value={rejectReason}
            fullWidth
            variant="outlined"
            onChange={e => setRejectReason(e.target.value)}
        />
    );

    const resetAlertModal = () => {
        setShowAlertModal(false);
        setExpiryDate(new Date().now);
        setRejectReason('');
    };

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
        label: 'Created Date',
      },
      { id: 'userId', numeric: true, disablePadding: false, label: 'User ID' },
      {
        id: 'username',
        numeric: false,
        disablePadding: false,
        label: 'Username',
      },
    //   {
    //     id: 'startDate',
    //     numeric: false,
    //     type: 'date',
    //     disablePadding: false,
    //     label: 'Start Date',
    //   },
      {
        id: 'dueDate',
        numeric: false,
        type: 'date',
        disablePadding: false,
        label: 'Due Date',
      },
      {
        id: 'desiredEndDate',
        numeric: false,
        disablePadding: false,
        label: 'Desired End Date',
      },
      { id: 'reason', numeric: false, disablePadding: false, label: 'Reason' },
      { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
    ];

    const acceptRenewRequest = (bookRequestId) => {
        setSelectedBookRequestId(bookRequestId);
        setRequestType(RequestType.ACCEPT);
        setShowAlertModal(true);
    };

    const rejectRenewRequest = (bookRequestId) => {
        setSelectedBookRequestId(bookRequestId);
        setRequestType(RequestType.REJECT);
        setShowAlertModal(true);
    };

    const onSuccessButtonPressed = async () => {
        try {
            if (requestType === RequestType.ACCEPT) {
                await axios.post('book-request/accept-extend-book-request', {
                    bookRequestId: selectedBookRequestId,
                    newDueDate: expiryDate,
                    url:BORROW_HISTORY,
                }).then(result => {
                    enqueueSnackbar('The expiry date has been successfully extended', {
                        variant: 'success',
                        transitionDuration: 1000
                    });
                    window.location.reload(false);
                    return result;
                });
            } else {
                await axios.post('book-request/reject-extend-book-request', {
                    bookRequestId: selectedBookRequestId,
                    rejectReason,
                    url:BORROW_HISTORY,
                }).then(result => {
                    enqueueSnackbar('The book request has been rejected', {
                        variant: 'success',
                        transitionDuration: 1000
                    });
                    window.location.reload(false);
                    return result;
                })
            }
        } catch (err) {
            enqueueSnackbar('Error occurred. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        }
        resetAlertModal();
        retrieveData();
    };

    const actionAreaHeadCells = [
        {
            id: 'accept',
            disablePadding: false,
            label: 'Accept',
            text: 'Accept',
            color: 'primary',
            disable: {id: 'status', criteria: 'ne', value: 'PROCESSING'},
            icon:<Check/>,
            action: acceptRenewRequest
        },
        {
            id: 'reject',
            disablePadding: false,
            label: 'Reject',
            text: 'Reject',
            color: 'secondary',
            disable: {id: 'status', criteria: 'ne', value: 'PROCESSING'},
            icon:<Delete/>,
            action: rejectRenewRequest
        },
    ];

    const searchCriteria = ['title', 'username'];

    return (
      <div>
        <h2 style={{ marginBottom: '10px' }}>Pending Renew Book Request</h2>
        <div style={{ marginBottom: '20px' }}>
          <EnhancedTable
            headCells={headCells}
            rows={bookRequests}
            actionAreaHeadCells={actionAreaHeadCells}
            searchCriteria={searchCriteria}
          />
        </div>

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <CustomModal
            showAlertModal={showAlertModal}
            title={
              requestType === RequestType.ACCEPT
                ? 'Insert Expiry Date to Continue'
                : "Please insert the reject reason"
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
        <CompletedRenewBookRequest />
      </div>
    );
};

export default PendingRenewBookRequest;
