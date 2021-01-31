import React from 'react';
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {Grid, TextField} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import PropTypes from "prop-types";
import EditLibraryMapCard from "./EditLibraryMap/EditLibraryMapCard";

const AutocompleteEmailField = props => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    const {onProfileSelected, name, label, inputRef, ...rest} = props;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const request = await axios.post('users/admin/get-all-profile');

            const profileList = request.data;
            if (active && profileList !== undefined) {
                setOptions(profileList);
            }

            return () => {
                active = false;
            };
        })();
    }, [loading])
    return (
        <Autocomplete
            {...rest}
            fullWidth
            id="select Id"
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => {
                return option.email === value.email
            }}
            getOptionLabel={(option) => {
                return option.email.toString();
            }}
            options={options}
            loading={loading}
            filterSelectedOptions
            onInputChange={(event, newInputValue) => {
                if (options.length > 0 && newInputValue.length > 0) {
                    let option = options.find(option => {
                        return option.email == newInputValue;
                    });
                    if (option) {
                        onProfileSelected(option);
                    }
                }

            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    name={name}
                    variant="outlined"
                    inputRef={inputRef}
                    label={label}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />)}
        />
    );
};

AutocompleteEmailField.propTypes = {
    onProfileSelected: PropTypes.func.isRequired,
    label: PropTypes.string,
};

export default AutocompleteEmailField;