import React, {useEffect,useState} from 'react';
import jwt_decode from "jwt-decode";
import axios from "axios";
import {useSnackbar} from "notistack";
import EnhancedTable from "../../../components/EnhancedTable";

const NotificationTable = () => {
    const [notifications, setNotifications] = React.useState([]);
    const {enqueueSnackbar} = useSnackbar();

    useEffect(()=>{
        if (localStorage.usertoken) {
            const token = localStorage.usertoken;
            const decoded = jwt_decode(token);
            const userId = decoded.id;
            axios.post('/notification/get-notifications', {userId}).then(result => {
                setNotifications(result.data);
            });
        }
    },[]);

    const deleteNotificationItem = (id) => {
        const selectedNotification = notifications.find(element => element.id === id);
        setNotifications(notifications.filter(element => element.id !== id));
        axios.post('/notification/delete-notification', {id}).catch(err => {
            setNotifications([...notifications, selectedNotification]);
            enqueueSnackbar('Error occurred. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        });
    };

    const headCells = [
        {id: 'title', numeric: false, disablePadding: false, label: 'Message'},
        {id: 'created', numeric: false, type: 'date', disablePadding: false, label: 'Date'},
    ];

    const actionAreaHeadCells = [
        {
            id: 'delete',
            disablePadding: false,
            label: 'Delete',
            text: 'Delete',
            color: 'secondary',
            action: deleteNotificationItem
        },
    ];
    return (
      <div>
        <h1 style={{ marginBottom: '20px' }}>Notifications</h1>
        <EnhancedTable
          headCells={headCells}
          rows={notifications}
          actionAreaHeadCells={actionAreaHeadCells}
          disableToolbar
        />
      </div>
    );
};

export default NotificationTable;
