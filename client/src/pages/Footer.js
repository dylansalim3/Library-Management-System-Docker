import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core";
import {topgreen} from "../style/Color";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

const useStyle = makeStyles({
    footer: {
        padding: "50px",
        minHeight: "30vh",
        backgroundColor: topgreen
    },
    whiteSeparator: {
        background: "white",
        width: "80px",
    },
    whiteText: {
        color: "white",
    },
});

const Footer = () => {
    const classes = useStyle();
    const [schoolName, setSchoolName] = useState('AL AMIN DARUL MUSTHOFA SCHOOL');
    const [schoolAddress, setSchoolAddress] = useState(['No. 11, Jalan TIB 2, Taman Industri Bolton,', ' 68100 Batu Caves, Selangor Darul Ehsan']);
    const [openingHours, setOpeningHours] = useState('9am-6pm');
    const [schoolEmail, setSchoolEmail] = useState('alamindarulmustofa@gmail.com');

    useEffect(() => {
        axios.get('setting/retrieve').then(res => {
            const returned = res.data.result;
            setSchoolName(returned.school_name);

            const addresses = returned.school_address.split(',')

            if (addresses.length > 3) {
                const firstAddress = addresses.slice(0, addresses.length - 2).join(',');
                const lastAddress = addresses.slice(addresses.length - 2, addresses.length).join(',');
                setSchoolAddress([firstAddress, lastAddress]);
            }else{
                setSchoolAddress([returned.school_address,''])
            }

            setOpeningHours(returned.opening_hours);
            setSchoolEmail(returned.email);
        });
    }, []);

    return (
        <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={3}
            className={classes.footer}>
            <Grid item md={6} xs={12} id="library-details">
                <hr className={classes.whiteSeparator}/>
                <Typography variant={"h6"} className={classes.whiteText}>{schoolName}</Typography>
                <p className={classes.whiteText}>{schoolAddress[0]}</p>
                <p className={classes.whiteText}>{schoolAddress[1]}</p>
            </Grid>
            <Grid item md={6} xs={12} id="library-opening-details">
                <hr className={classes.whiteSeparator}/>
                <Typography variant={"h6"} className={classes.whiteText}>Library Opening
                    Hours: {openingHours}</Typography>
                <p className={classes.whiteText}>Email: {schoolEmail}</p>
            </Grid>

        </Grid>
    );
};

export default Footer;
