import {
    Add,
    Assignment,
    Autorenew,
    Backup,
    Book,
    Edit, Extension,
    GroupAdd, History,
    Map,
    Person,
    PersonAdd,
    Redeem, Settings
} from "@material-ui/icons";
import React from 'react';

export const SIDEBAR_ROUTE_ADMIN = [
    {name: 'Dashboard', route: 'admindashboard', icon: <Assignment/>},
    {name: 'Add book', route: 'add_book', icon: <Add/>},
    {name: 'Edit/Delete book', route: 'edit_book', icon: <Edit/>},
    {name: 'Borrow/Return/Renew', route: 'borrowbook', icon: <Autorenew/>},
    {name: 'View Borrow History', route: 'view-borrow-history', icon: <History/>},
    {name: 'Book Reservation', route: 'reservebook', icon: <Redeem/>},
    {name: 'Library Map', route: 'library_map', icon: <Map/>},
    {name: 'Data Backup', route: 'backup_data', icon: <Backup/>},
    {name: 'Account Registration', route: 'registration', icon: <PersonAdd/>},
    {name: 'Profile', route: 'profile', icon: <Person/>},
    {name: 'Role Assignment', route: 'role_assignment', icon: <GroupAdd/>},
    {name: 'Setting', route: 'setting', icon: <Settings/>}
];

export const SIDEBAR_ROUTE_STUDENT = [
    {name: 'Dashboard', route: 'studentdashboard', icon: <Assignment/>},
    {name: 'Search book', route: 'searchbook', icon: <Book/>},
    {name: 'Book Reservation', route: 'reservation', icon: <Redeem/>},
    {name: 'Borrow History', route: 'borrowhistory', icon: <History/>},
    {name: 'Extend Borrow', route: 'extendborrow', icon: <Extension/>},
    {name: 'Library Map', route: 'view_library_map', icon: <Map/>},
    {name: 'Profile', route: 'profile', icon: <Person/>},
];

export const SIDEBAR_ROUTE_TEACHER = [
    {name: 'Dashboard', route: 'studentdashboard', icon: <Assignment/>},
    {name: 'Search book', route: 'searchbook', icon: <Book/>},
    {name: 'Pending Reservation', route: 'reservation', icon: <Redeem/>},
    {name: 'Borrow History', route: 'borrowhistory', icon: <History/>},
    {name: 'Extend Borrow', route: 'extendborrow', icon: <Extension/>},
    {name: 'Library Map', route: 'view_library_map', icon: <Map/>},
    {name: 'Profile', route: 'profile', icon: <Person/>},
    {name: 'Student Registration', route: 'studentregistration', icon: <GroupAdd/>},
];

export const SIDEBAR_ROUTE_LIBRARIAN = [
    {name: 'Dashboard', route: 'studentdashboard', icon: <Assignment/>},
    {name: 'Add book', route: 'add_book', icon: <Add/>},
    {name: 'Edit/Delete book', route: 'edit_book', icon: <Edit/>},
    {name: 'Borrow/Return/Renew', route: 'borrowbook', icon: <Autorenew/>},
    {name: 'View Borrow History', route: 'view-borrow-history', icon: <History/>},
    {name: 'Book Reservation', route: 'reservebook', icon: <Redeem/>},
    {name: 'Library Map', route: 'library_map', icon: <Map/>},
    {name: 'Profile', route: 'profile', icon: <Person/>},
];
