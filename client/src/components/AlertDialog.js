import React from 'react';
import PropTypes from 'prop-types';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";


const AlertDialog = props => {
    const showAlertModal = props.showAlertModal;
    const onCloseConfirmationModal = props.onCloseConfirmationModal;
    const title = props.title;
    const desc = props.desc;
    const confirmationText = props.confirmationText;
    return (
        <Dialog open={showAlertModal}
                onClose={onCloseConfirmationModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{desc}</DialogContent>
            <DialogActions>
                <Button onClick={onCloseConfirmationModal} color="primary">
                    {confirmationText?confirmationText:'Ok'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

AlertDialog.propTypes = {
    showAlertModal: PropTypes.bool,
    onCloseConfirmationModal: PropTypes.func,
    title:PropTypes.string,
    desc:PropTypes.string|PropTypes.array,
};

export default AlertDialog;