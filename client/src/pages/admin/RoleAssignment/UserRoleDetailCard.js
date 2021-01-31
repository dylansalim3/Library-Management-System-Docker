import * as React from 'react';
import {Box, CardMedia, Grid} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {formatDate} from "../../../util/DateUtils";
import * as PropTypes from "prop-types";
import {BASE_URL} from "../../../constant/route.constant";
import NoBookImagePlaceholder from "../../../images/book-placeholder.jpg";


export function UserDetailCard(props) {
    const {profileImg, name, email, phoneNumber, roles, address, dateCreated} = props;
    return (
        <Box width="100%">
            <Card style={{margin: 10,padding:10}}>
                <CardContent>
                    <h2 className="textCenter">User Information</h2>
                    <Box p={1}>
                        <Grid container spacing={1}>
                            <Grid item md={4} xs={12}>
                                <img style={{height: 128, width: 128}} src={BASE_URL + profileImg} alt="book_img"                   onError={(e)=>{e.target.onerror = null; e.target.src=NoBookImagePlaceholder}}
                                />
                            </Grid>
                            <Grid item md={8} xs={12}>
                                <p style={{display: 'flex', justifyContent: 'space-between',textTransform:'capitalize'}}>
                                    <span>Name</span>
                                    <span>{name}</span>
                                </p>
                                <p style={{display: 'flex', justifyContent: 'space-between',textTransform:'capitalize'}}>
                                    <span>Role</span>
                                    <span>{roles.map(role=>{
                                        return role.role;
                                    }).join(',')}</span>
                                </p>
                                <p style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span>Phone Number</span>
                                    <span>{phoneNumber ? phoneNumber : '-'}</span>
                                </p>
                                <p style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span>Email</span>
                                    <span>{email}</span>
                                </p>
                                <p style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span>Phone Number</span>
                                    <span>{phoneNumber ? phoneNumber : '-'}</span>
                                </p>
                                <Grid container>
                                    <Grid item xs={3}>
                                        Address
                                    </Grid>
                                    <Grid item xs={9} className="textRight">
                                        <span>{address ? address : '-'}</span>
                                    </Grid>
                                </Grid>
                                <p style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <span>Date Created</span>
                                    <span>{dateCreated ? formatDate(dateCreated) : '-'}</span>
                                </p>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

UserDetailCard.propTypes = {
    profileImg: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    roles: PropTypes.array,
    address: PropTypes.string,
    dateCreated: PropTypes.string,
};
