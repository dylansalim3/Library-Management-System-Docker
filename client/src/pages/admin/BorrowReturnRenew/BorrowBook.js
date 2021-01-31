import React from 'react';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import {Box, Tab, Typography} from '@material-ui/core';
import '../../../style/Style.css';
import AdminBoilerplate from "../AdminBoilerplate";
import BorrowBookTab from "./BorrowBookTab";
import ReturnBookTab from "./ReturnBookTab";
import RenewBookTab from "./RenewBookTab";
import {useParams} from "react-router-dom";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography component="span">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const BorrowBook = () => {
    const [tabIndex, setTabIndex] = React.useState(0);
    const {id} = useParams();

    React.useEffect(() => {
        const tab = sessionStorage.getItem('tabIndex');
        if (id) {
            setTabIndex(parseInt(id));
        }else if(tab){
            setTabIndex(parseInt(tab));
        }
    }, []);

    const onChangeTabs = (e, value) => {
        sessionStorage.setItem('tabIndex', value);
        setTabIndex(value);
    };

    return (
        <div>
            <AdminBoilerplate page={"borrowbook"}/>
            <div className="content">
                <Paper>
                    <Tabs
                        value={tabIndex}
                        onChange={onChangeTabs}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab label="Borrow" id={'simple-tab-' + 0} aria-controls={`simple-tabpanel-${0}`}/>
                        <Tab label="Return" id={'simple-tab-' + 1} aria-controls={`simple-tabpanel-${1}`}/>
                        <Tab label="Renew" id={'simple-tab-' + 2} aria-controls={`simple-tabpanel-${2}`}/>

                    </Tabs>
                    <TabPanel value={tabIndex} index={0}>
                        <BorrowBookTab/>
                    </TabPanel>
                    <TabPanel value={tabIndex} index={1}>
                        <ReturnBookTab/>
                    </TabPanel>
                    <TabPanel value={tabIndex} index={2}>
                        <RenewBookTab/>
                    </TabPanel>
                </Paper>
            </div>
        </div>
    );
};

export default BorrowBook;
