import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {SnackbarContent, useSnackbar} from 'notistack';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Box from "@material-ui/core/Box/Box";
import Avatar from "@material-ui/core/Avatar/Avatar";
import CancelIcon from '@material-ui/icons/Cancel';
import moment from "moment";

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.up('sm')]: {
            minWidth: '344px !important',
        },
    },
    card: {
        backgroundColor: '#ffffff',
        width: '100%',
    },
    typographyBold: {
        fontWeight: 'bold',
    },
    typographyTitle: {
        margin: 10,
        fontSize: 14
    },
    typographyDate:{
        fontSize:12,
        fontWeight:'bold',
        color:'#4267B2',
        marginLeft:'10px'
    },
    actionRoot: {
        padding: '8px 8px 8px 16px',
        display: 'flex',
        justifyContent: 'space-between'
    },
    icons: {
        marginLeft: 'auto',
    },
    expand: {
        padding: '8px 8px',
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    notificationContent: {
        "&:hover": {
            backgroundColor: '#e7e7e7',
            cursor: 'pointer'
        }
    }
}));

const NotificationSnackbar = React.forwardRef((props, ref) => {
    const classes = useStyles();
    const {closeSnackbar} = useSnackbar();

    const handleDismiss = () => {
        closeSnackbar(props.id);
    };

    const {title, url, enablePush, priority, thumbnailUrl, created} = props.message;

    const redirectToUrl = () => {
        window.location.href = url;
    };

    return (
        <SnackbarContent ref={ref} className={classes.root}>
            <Card className={classes.card}>
                <CardActions classes={{root: classes.actionRoot}}>
                    <Typography variant="subtitle2" className={classes.typographyBold}>{'New Notification'}</Typography>
                    <div className={classes.icons}>
                        <IconButton className={classes.expand} onClick={handleDismiss}>
                            <CancelIcon/>
                        </IconButton>
                    </div>
                </CardActions>
                <Box display="flex" justifyContent="flex-start" alignContent="center"
                     className={classes.notificationContent} onClick={redirectToUrl}>
                    <Avatar style={{margin: 10}} src={thumbnailUrl}/>
                    <Box display="flex" flexDirection="column">
                        <Typography gutterBottom className={classes.typographyTitle}>{title}</Typography>
                        <Typography gutterBottom className={classes.typographyDate}>{moment(created).fromNow()}</Typography>
                    </Box>
                </Box>
            </Card>
        </SnackbarContent>
    );
});
export default NotificationSnackbar;