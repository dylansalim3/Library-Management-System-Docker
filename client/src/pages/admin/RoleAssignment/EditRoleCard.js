//@flow

import * as React from 'react';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import PropTypes from 'prop-types';
import {useEffect, useState} from "react";
import * as axios from "axios";
import TableContainer from "@material-ui/core/TableContainer";
import {Box, Paper, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import {Clear} from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";

type Props = {
    name: string,
    selectedRoleId: number[],
    onAddRole: (roleId: number)=>void,
    onDeleteRole: (roleId: number)=>void
};

export function EditRoleCard(props: Props) {
    const [availableRoles, setAvailableRoles] = useState([]);
    const [error, setError] = useState(false);
    const loading = availableRoles.length === 0;

    const userName = props.name;
    let selectedRoleId = props.selectedRoleId;
    const {onAddRole, onDeleteRole} = props;

    useEffect(() => {
        axios.get('roles/admin/get-roles').then(result => {
            setAvailableRoles(result.data);
        }).catch(err => {
            setError(true);
        });
    }, [loading]);

    return (
        <Box width="100%">
            <Card style={{margin: 10}}>
                <CardContent>
                    <h2 className="textCenter">Edit Role of {userName}</h2>
                    {loading ? error ? <p>Error occured...Please try again later</p> : <CircularProgress/> :
                        <div>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center">Role</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {availableRoles ? availableRoles.map((availableRole, index) => (
                                            <TableRow key={availableRole.id}>
                                                <TableCell align="center">{availableRole.role}</TableCell>
                                                <TableCell align="center">
                                                    {!selectedRoleId.includes(availableRole.id) ?
                                                        <Button variant="contained" color="primary"
                                                                onClick={() => onAddRole(availableRole.id)}>Add
                                                            Role</Button>
                                                        :
                                                        <IconButton color="primary"
                                                                    onClick={() => onDeleteRole(availableRole.id)}
                                                                    aria-label="Remove Role" component="span">
                                                            <Clear/>
                                                        </IconButton>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        )) : ''}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    }
                </CardContent>
            </Card>
        </Box>

    );
};