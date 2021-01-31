import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import moment from "moment";
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import {Search} from "@material-ui/icons";
import NoImagePlaceholder from "./../images/No-Image-Placeholder.png";
import {BASE_URL} from "../constant/route.constant";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}


const AutoDetectButton = React.forwardRef((props, ref) => {
    const {actionbuttonicon, actionbuttontext} = props;
    return actionbuttonicon ? (<Tooltip title={actionbuttontext}>
        <IconButton aria-label={actionbuttontext} {...props} forwardedRef={ref}>
            {actionbuttonicon}
        </IconButton>
    </Tooltip>) : (
        <Button id="iconButton"
                {...props} ref={ref}>
            {actionbuttontext}
        </Button>
    );
});


const EnhancedTableHead = (props) => {
    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        headCells,
        disableCheckbox,
        disableActionButton,
        disableDefaultIndex,
        actionButtonText,
        actionAreaHeadCells
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {!disableCheckbox && (<TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{'aria-label': 'select all desserts'}}
                    />
                </TableCell>)}
                {!disableDefaultIndex && (
                    <TableCell align="center">
                        No
                    </TableCell>
                )}

                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'center' : 'center'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >


                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                {actionAreaHeadCells && actionAreaHeadCells.map(actionAreaHeadCell => (
                    <TableCell
                        key={actionAreaHeadCell.label}
                        align="center"
                        padding={actionAreaHeadCell.disablePadding ? 'none' : 'default'}>
                        {actionAreaHeadCell.label}
                    </TableCell>
                ))}
                {!disableActionButton && (
                    <TableCell align="center">
                        {actionButtonText}
                    </TableCell>
                )}

            </TableRow>
        </TableHead>
    );
};

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    headCells: PropTypes.array.isRequired,
    disableCheckbox: PropTypes.bool,
    disableDefaultIndex: PropTypes.bool,
    disableActionButton: PropTypes.bool,
    actionButtonText: PropTypes.string,
    actionAreaHeadCells: PropTypes.array,
};

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const EnhancedTableToolbar = (props) => {
    const classes = useToolbarStyles();
    const {
        numSelected,
        onDeleteSelection,
        actionButtonText,
        actionButtonIcon,
        enableSearch,
        searchText,
        onSearchTextChanged
    } = props;

    return (
        <Toolbar
            className={clsx(classes.root, {
                [classes.highlight]: numSelected > 0,
            })}
        >
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : (
                <Typography className={classes.title} variant="h6" id="tableTitle" component="div">

                </Typography>
            )}

            {enableSearch && <TextField
                placeholder="Search"
                value={searchText}
                onChange={(e) => onSearchTextChanged(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search/>
                        </InputAdornment>
                    )
                }}
            />}
            {
                numSelected > 0 && (
                    <AutoDetectButton
                        actionbuttontext={actionButtonText}
                        actionbuttonicon={actionButtonIcon}
                        onClick={onDeleteSelection}
                    />
                )}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onDeleteSelection: PropTypes.func,
    actionButtonText: PropTypes.string,
    actionButtonIcon: PropTypes.object,
    enableSearch: PropTypes.bool.isRequired,
    searchText: PropTypes.string,
    onSearchTextChanged: PropTypes.func,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

const EnhancedTable = (props) => {
    const classes = useStyles();
    const {
        headCells,
        rows,
        onDeleteSelection,
        disableToolbar,
        disableDefaultIndex,
        actionAreaHeadCells,
        actionButtonText,
        actionButtonIcon,
        searchCriteria
    } = props;
    const [disableSelection, setDisableSelection] = React.useState(true);
    const [filteredRows, setFilteredRows] = React.useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(headCells[0].label);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchText, setSearchText] = React.useState('');

    React.useEffect(() => {
        setFilteredRows(rows);
    }, [rows]);

    React.useEffect(() => {
        setDisableSelection(actionButtonText === undefined);
    }, []);

    React.useEffect(() => {
        filterRows();
    }, [searchText]);

    const filterRows = () => {
        if (typeof searchCriteria == "object" && searchCriteria !== undefined) {

            const filteredRows = rows.filter((row) => {
                const rowText = [];
                for (let search of searchCriteria) {
                    rowText.push(row[search].toString());
                }
                return rowText.some(text => {
                    return text.match(new RegExp(searchText, 'i'))
                })
            });
            setFilteredRows(filteredRows);

        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = filteredRows.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredRows.length - page * rowsPerPage);

    const emitDeleteSelection = () => {
        onDeleteSelection(selected);
        setSelected([]);
    };

    const generateTableRow = (row, headCell) => {
        if (!row[headCell.id]) {
            return '-';
        } else if (headCell.type === 'img') {
            return (<img src={BASE_URL + row[headCell.id]} alt="img" onError={(e)=>{e.target.onerror = null; e.target.src=NoImagePlaceholder}}

                         style={{width: '120px', height: '120px'}}/>);
        } else if (headCell.type === 'date') {
            return moment(row[headCell.id]).format("DD-MMM-YYYY");
        } else {
            return row[headCell.id].toString();
        }
    };

    const emptyRow = () => {
        let mid = headCells.length / 2;
        return (
            <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
                {headCells.map((headCell, index) => {
                    if (index === mid) {
                        return <TableCell style={{width: 'auto', textAlign: 'center'}}>No Content</TableCell>;
                    } else {
                        return <TableCell style={{width: 'auto', textAlign: 'center'}}/>;
                    }
                })}
            </TableRow>
        );

    };

    const createOperatorStatement = (row, id, criteria, value) => {
        switch (criteria) {
            case 'eq':
                return row[id] === value;
            case 'ne':
                return row[id] !== value;
            case 'lt':
                return row[id] < value;
            case 'gt':
                return row[id] > value;
            case 'lte':
                return row[id] <= value;
            case 'gte':
                return row[id] >= value;
        }
    };


    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                {!disableToolbar && (
                    <EnhancedTableToolbar
                        numSelected={selected.length}
                        onDeleteSelection={emitDeleteSelection}
                        actionButtonText={actionButtonText}
                        actionButtonIcon={actionButtonIcon}
                        enableSearch={searchCriteria}
                        searchText={searchText}
                        onSearchTextChanged={setSearchText}
                    />
                )}
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={filteredRows.length}
                            headCells={headCells}
                            disableCheckbox={disableSelection}
                            disableDefaultIndex={disableDefaultIndex}
                            disableActionButton={disableSelection || selected.length > 0}
                            actionButtonText={actionButtonText}
                            actionAreaHeadCells={actionAreaHeadCells}
                        />
                        <TableBody>
                            {stableSort(filteredRows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            key={"table-row" + index}
                                            id="table-row"
                                            hover
                                            onClick={(event) => {
                                                if (!disableSelection) {
                                                    handleClick(event, row.id)
                                                }
                                            }}
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={row.name}
                                            selected={isItemSelected}
                                        >
                                            {!disableSelection && (<TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{'aria-labelledby': labelId}}
                                                />
                                            </TableCell>)}
                                            {!disableDefaultIndex && (<TableCell align="center">
                                                {index + 1}
                                            </TableCell>)}

                                            {headCells.map(headCell =>
                                                <TableCell
                                                    key={headCell.id}
                                                    align="center"
                                                    style={{textTransform: 'capitalize'}}>
                                                    {generateTableRow(row, headCell)}
                                                </TableCell>
                                            )}
                                            {actionAreaHeadCells && actionAreaHeadCells.map(actionAreaHeadCell => (
                                                <TableCell
                                                    key={actionAreaHeadCell.id}
                                                    align="center">
                                                    {
                                                        (actionAreaHeadCell.disable &&
                                                            createOperatorStatement(row, actionAreaHeadCell.disable.id,
                                                                actionAreaHeadCell.disable.criteria, actionAreaHeadCell.disable.value))
                                                            ? '-' : (
                                                                <AutoDetectButton
                                                                    actionbuttontext={actionAreaHeadCell.text}
                                                                    color={actionAreaHeadCell.color}
                                                                    variant="contained"
                                                                    actionbuttonicon={actionAreaHeadCell.icon}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        actionAreaHeadCell.action(row.id);
                                                                    }}
                                                                />)
                                                    }

                                                </TableCell>
                                            ))}
                                            {!disableSelection && selected.length === 0 &&
                                            <TableCell align="center">
                                                <AutoDetectButton
                                                    actionbuttontext={actionButtonText}
                                                    color="primary"
                                                    variant="contained"
                                                    actionbuttonicon={actionButtonIcon}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteSelection([row.id]);
                                                    }}/>
                                            </TableCell>
                                            }

                                        </TableRow>
                                    );
                                })}
                            {filteredRows.length === 0 && emptyRow()
                            }
                            {filteredRows.length > rowsPerPage && emptyRows > 0 && (
                                <TableRow style={{height: (dense ? 33 : 53) * emptyRows}}>
                                    <TableCell colSpan={6}/>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {filteredRows.length > rowsPerPage && (
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={filteredRows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                )}
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense}/>}
                label="Dense padding"
            />
        </div>
    );
};

EnhancedTable.propTypes = {
    headCells: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    onDeleteSelection: PropTypes.func,
    disableToolbar: PropTypes.bool,
    disableDefaultIndex: PropTypes.bool,
    actionAreaHeadCells: PropTypes.array,
    actionButtonText: PropTypes.string,
    actionButtonIcon: PropTypes.object,
    searchCriteria: PropTypes.array,
};

export default EnhancedTable;
