import React, {useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import drawerLogo from './../images/dashboardlogo.png';

import {Link, withRouter} from 'react-router-dom';
import {drawergreen, topgreen} from '../style/Color';
import {
    SIDEBAR_ROUTE_ADMIN,
    SIDEBAR_ROUTE_LIBRARIAN,
    SIDEBAR_ROUTE_STUDENT,
    SIDEBAR_ROUTE_TEACHER
} from "../constant/SidebarRoute.constant";
import jwt_decode from "jwt-decode";
import {disconnectSocket, initSocket, sendNotification, subscribeToNotification} from "../util/SocketUtils";
import {useSnackbar} from "notistack";
import NotificationSnackbar from "./NotificationSnackbar";
import SidebarItem from "./SidebarItem";
import Button from "@material-ui/core/Button/Button";
import Box from "@material-ui/core/Box/Box";
import {ListItemIcon} from "@material-ui/core";
import {ExitToApp} from "@material-ui/icons";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('md')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    overrides: {
        MuiContainer: {
            maxWidth: false,
        },
    },
}));

function Sidebar(props) {
    const {window} = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);


    const {enqueueSnackbar} = useSnackbar();


    useEffect(() => {
        if (localStorage.usertoken) {
            const token = localStorage.usertoken;
            const decoded = jwt_decode(token);
            const userId = decoded.id;
            initSocket();
            sendNotification(userId);
            subscribeToNotification(handleNotification);
            return () => {
                disconnectSocket(userId);
            }
        }
    }, []);

    const handleNotification = (result) => {
        enqueueSnackbar(
            result
            , {
                persist: true, content: (key, message) => (
                    <NotificationSnackbar id={key} message={message}/>
                )
            })
        ;
    };


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const logout = () => {
        localStorage.removeItem('usertoken');
        props.history.push('/');
    };

    const style = {
        color: 'white',
    };

    const returnMenus = (role) => {
        var arr = [];
        if (role === 'admin') {
            arr = SIDEBAR_ROUTE_ADMIN;
        } else if (role === 'student') {
            arr = SIDEBAR_ROUTE_STUDENT;
        } else if (role === 'teacher') {
            arr = SIDEBAR_ROUTE_TEACHER;
        } else if (role === 'librarian') {
            arr = SIDEBAR_ROUTE_LIBRARIAN;
        }
        return (
            <div>
                {arr.map((data, index) => (
                    <ListItem
                        button
                        key={data.name}
                        component={Link}
                        to={`/${data.route}`}
                        style={{
                            ...style,
                            ...{
                                backgroundColor:
                                    props.selected === data.route ? topgreen : drawergreen,
                            },
                        }}
                    >
                        <ListItemIcon style={{color: 'white'}}>
                            {data.icon}
                        </ListItemIcon>
                        <ListItemText primary={data.name}/>
                    </ListItem>
                ))}
                <div style={{position: 'fixed', bottom: 10, width: drawerWidth}}>
                    <Box component="div" display="flex" justifyContent="center">
                        <Button startIcon={<ExitToApp/>} variant="contained" color="secondary"
                                onClick={logout}>Logout</Button>
                    </Box>
                </div>
            </div>
        );
    };

    const drawer = (
        <div style={{backgroundColor: drawergreen, height: '100%'}}>
            <div
                className={classes.toolbar}
                style={{
                    backgroundColor: topgreen,
                    paddingLeft: '20px',
                    alignItems: 'center',
                    display: 'flex',
                }}
            >
                <img src={drawerLogo} alt="logo" width="200"/>
                {/*<h2 style={{color: 'white'}}>E-library</h2>*/}
            </div>
            <Divider/>

            <List style={{marginTop: '30px'}}>{returnMenus(props.role)}</List>
        </div>
    );

    const container =
        window !== undefined ? () => window().document.body : undefined;


    return (
        <div>
            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar
                        style={{
                            backgroundColor: topgreen,
                            justifyContent: 'space-between',
                        }}
                    >
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Hidden smDown>
                            <SidebarItem/>
                        </Hidden>
                        <Hidden mdUp>
                            <div
                                style={{
                                    width: '100%',
                                    paddingRight: '30px',
                                    display: 'flex',
                                    justifyContent: 'flex-start',
                                }}
                            >
                                {/*<Typography variant="h6" noWrap>*/}
                                {/*    E-library*/}
                                {/*</Typography>*/}
                            </div>
                            <SidebarItem/>

                        </Hidden>
                    </Toolbar>
                </AppBar>
                <nav className={classes.drawer} aria-label="mailbox folders">
                    <Hidden mdUp implementation="css">
                        <Drawer
                            container={container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden smDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                </nav>
                <div>
                    <div className={classes.toolbar}/>
                </div>
            </div>
        </div>
    );
}

export default withRouter(Sidebar);
