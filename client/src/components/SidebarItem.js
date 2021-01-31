import React, {useEffect} from 'react';
import IconButton from "@material-ui/core/IconButton/IconButton";
import Badge from "@material-ui/core/Badge/Badge";
import {ExitToApp, Notifications, PhotoCamera} from "@material-ui/icons";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Popover from "@material-ui/core/Popover/Popover";
import Box from "@material-ui/core/Box/Box";
import Typography from "@material-ui/core/Typography/Typography";
import Chip from "@material-ui/core/Chip/Chip";
import Divider from "@material-ui/core/Divider/Divider";
import Button from "@material-ui/core/Button/Button";
import {makeStyles} from "@material-ui/core";
import deepOrange from "@material-ui/core/colors/deepOrange";
import deepPurple from "@material-ui/core/colors/deepPurple";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import jwt_decode from "jwt-decode";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import {FixedSizeList} from "react-window";
import ListItemAvatar from "@material-ui/core/ListItemAvatar/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import moment from "moment";
import DeleteIcon from '@material-ui/icons/Delete';
import {OverlayScrollbarsComponent} from 'overlayscrollbars-react';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import withRouter from "react-router-dom/es/withRouter";
import {useSnackbar} from "notistack";
import {BASE_URL, PROFILE} from './../constant/route.constant';


const SidebarItem = (props) => {

    const useStyles = makeStyles((theme) => ({
        notificationList: {
            width: '100%',
            maxHeight: '200px',
            maxWidth: '480',
            backgroundColor: theme.palette.background.paper,
            position: 'relative',
            overflow: 'auto',
        },
        orangeAvatar: {
            color: theme.palette.getContrastText(deepOrange[500]),
            backgroundColor: deepOrange[500],
        },
        purpleAvatar: {
            color: theme.palette.getContrastText(deepPurple[500]),
            backgroundColor: deepPurple[500],
        },
        smallAvatar: {
            width: theme.spacing(3),
            height: theme.spacing(3),
        },
        largeAvatar: {
            width: theme.spacing(7),
            height: theme.spacing(7),
        }
    }));

    const classes = useStyles();
    const [userId, setUserId] = React.useState(-1);
    const [email, setEmail] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [profileImg, setProfileImg] = React.useState('');
    const [unreadNotificationCount, setUnreadNotificationCount] = React.useState(0);
    const [notifications, setNotifications] = React.useState([]);
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        if (localStorage.usertoken) {
            const token = localStorage.usertoken;
            const decoded = jwt_decode(token);
            const userId = decoded.id;
            setUserId(userId);
            setEmail(decoded.email);
            setFirstName(decoded.first_name);
            setProfileImg(decoded.profileimg);
            axios.post('/notification/get-unread-notification-count', {userId}).then(result => {
                const {count} = result.data;
                setUnreadNotificationCount(count);
            });
            axios.post('/notification/get-notifications', {userId}).then(result => {
                setNotifications(result.data);
            });
        }
    }, []);

    const [anchorElNotification, setAnchorElNotification] = React.useState(null);
    const isNotificationMenuOpen = Boolean(anchorElNotification);
    const notificationMenuId = isNotificationMenuOpen ? 'notification-menu' : undefined;

    const [anchorElAvatar, setAnchorElAvatar] = React.useState(null);
    const isAvatarMenuOpen = Boolean(anchorElAvatar);
    const avatarMenuId = isAvatarMenuOpen ? 'avatar-menu' : undefined;

    const openAvatarMenu = (event) => {
        setAnchorElAvatar(event.target);
    };

    const closeAvatarMenu = () => {
        setAnchorElAvatar(null);
    };

    const goToManageProfile = () => {
        window.location.href = PROFILE;
    };

    const openNotificationMenu = (event) => {
        setAnchorElNotification(event.target);
        // Set all unread notifications count to zero
        if (unreadNotificationCount > 0) {
            const initialUnreadNotificationCount = unreadNotificationCount;
            setUnreadNotificationCount(0);
            axios.post('/notification/update-all-notifications-to-read', {userId}).catch(err => {
                setUnreadNotificationCount(initialUnreadNotificationCount);
            });
        }
    };

    const closeNotificationMenu = () => {
        setAnchorElNotification(null);
    };

    const PhotoCameraIcon = withStyles((theme) => ({
        root:
            {height: '16px', width: '16px', ":hover": {color: 'red'}}
        ,
    }))(PhotoCamera);

    const logout = () => {
        localStorage.removeItem('usertoken');
        props.history.push('/');
    };

    const onNotificationClick = (id, url) => {
        axios.post('/notification/update-notification-to-read', {id}).then(res => {
            window.location.href = url;
        });
    };

    const deleteNotificationItem = (id) => {
        const selectedNotification = notifications.find(element => element.id === id);
        setNotifications(notifications.filter(element => element.id !== id));
        axios.post('/notification/delete-notification', {id}).catch(err => {
            setNotifications([...notifications, selectedNotification]);
            enqueueSnackbar('Error occurred. Please Try Again Later', {variant: 'error', transitionDuration: 1000});
        });
        setUnreadNotificationCount(selectedNotification.unread === true ? unreadNotificationCount - 1 : unreadNotificationCount);
    };


    const row = ({index, style}) => (
        <div style={style}>
            <ListItem key={index} ContainerComponent={"div"} button
                      onClick={() => onNotificationClick(notifications[index].id, notifications[index].url)}>
                <ListItemAvatar>
                    <Avatar src={notifications[index].thumbnail_url}/>
                </ListItemAvatar>
                <ListItemText primary={notifications[index].title}
                              secondary={moment(notifications[index].created).fromNow()}
                              secondaryTypographyProps={{color: 'primary', variant: 'subtitle2'}}/>
                {notifications[index].unread ? <span style={{color: "#2e89ff"}}>&#11044;</span>
                    : ''}
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete"
                                onClick={() => deleteNotificationItem(notifications[index].id)}>
                        <DeleteIcon/>
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </div>
    );

    const CustomScrollbarsVirtualList = React.forwardRef((props, ref) => (
        <OverlayScrollbarsComponent options={{
            scrollbars: {
                visibility: "auto",
                autoHide: "leave",
                autoHideDelay: 125,
                dragScrolling: true,
                clickScrolling: true,
                touchSupport: true,
                snapHandle: false
            }
        }} {...props} forwardedRef={ref}/>
    ));


    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',

            }}
        >
            <IconButton aria-label="notifications" color="inherit"
                        onClick={openNotificationMenu}>
                <Badge badgeContent={unreadNotificationCount} color="secondary">
                    <Notifications/>
                </Badge>
            </IconButton>
            <IconButton
                edge="end"
                aria-label="account of current user"
                // aria-controls={menuId}
                aria-haspopup="true"
                onClick={openAvatarMenu}
                color="inherit"
            >
                <Avatar className={profileImg ?? classes.purpleAvatar} src={BASE_URL + profileImg}
                        alt={firstName ? firstName.charAt(0) : 'U'}/>
            </IconButton>

            <Popover
                id={notificationMenuId}
                open={isNotificationMenuOpen}
                anchorEl={anchorElNotification}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={closeNotificationMenu}
                style={{marginTop: "2px"}}
            >
                <Box display="flex" justifyContent="center" flexDirection="column">
                    <div className={classes.navigationList}>
                        <h2 style={{marginLeft: "20px", margin: "15px"}}>Notifications</h2>
                        {notifications.length !== 0 ? (
                            <FixedSizeList key={1} outerElementType={CustomScrollbarsVirtualList} height={400}
                                           width={300}
                                           itemCount={notifications.length} itemSize={70}>
                                {row}
                            </FixedSizeList>


                        ) : <div style={{margin: '20px'}}>No notification found</div>}
                    </div>

                </Box>
            </Popover>


            <Popover
                id={avatarMenuId}
                open={isAvatarMenuOpen}
                anchorEl={anchorElAvatar}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                onClose={closeAvatarMenu}
                style={{marginTop: "2px"}}
            >
                <Box display="flex" justifyContent="center" flexDirection="column" mx={6} my={3}>
                    <Box display="flex" justifyContent="center" component="div" p={1}>
                        <Badge
                            overlap="circle"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            badgeContent={<IconButton variant="contained"
                                                      style={{backgroundColor: 'white'}}
                                                      size="small">
                                <PhotoCameraIcon/>

                            </IconButton>
                            }
                        >
                            <Avatar className={profileImg ?? [classes.purpleAvatar, classes.largeAvatar]}
                                    src={BASE_URL + profileImg}
                                    alt={firstName ? firstName.charAt(0) : 'U'}/>
                        </Badge>
                    </Box>
                    <Box component="div" display="flex" flexDirection="column">
                        <Typography variant="subtitle2"
                                    className="textCenter">{`${firstName ? firstName : 'User'}`}</Typography>
                        <Typography variant="subtitle1"
                                    className="textCenter">{email}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" pt={1}>
                        <Chip size="medium" style={{fontWeight: 'bold'}} label="Manage Profile"
                              onClick={goToManageProfile}
                              variant="outlined"/>
                    </Box>
                </Box>

                <Divider variant="fullWidth" light/>
                <Box display="flex" justifyContent="center" flexDirection="column" mx={6} my={3}>
                    <Box component="div" display="flex" justifyContent="center">
                        <Button startIcon={<ExitToApp/>} variant="contained" color="secondary"
                                onClick={logout}>Logout</Button>
                    </Box>
                </Box>
            </Popover>

        </div>
    );
};

export default withRouter(SidebarItem);
