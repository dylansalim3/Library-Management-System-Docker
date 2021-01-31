import React, {useRef, useState} from 'react';
import {Button, Grid, TextField} from "@material-ui/core";
import {DropzoneArea} from "material-ui-dropzone";
import Box from "@material-ui/core/Box";
import * as axios from "axios";
import PropTypes from "prop-types";
import {useForm} from "react-hook-form";


const UploadLibraryMapForm = (props) => {

    const [imageFile, setImageFile] = useState(null);
    const [mapFloor, setMapFloor] = useState("");
    const [mapName, setMapName] = useState("");
    const [inputKey, setInputKey] = useState(1);

    const fileHelperTextRef = useRef(null);

    const {register, handleSubmit, watch, setValue, errors} = useForm();

    const validateForm = () => {
        if (imageFile.length === 0) {
            fileHelperTextRef.current.style.display = "inline-block";
            return false;
        }
        return true;
    }

    const onSubmit = (e) => {
        // e.preventDefault();
        const validated = validateForm();
        if(validated){
            const formData = new FormData();
            formData.append('file', imageFile[0]);
            formData.append('floorName', mapFloor);
            formData.append('name', mapName);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            axios.post('library-maps/update-library-map', formData, config).then(result => {
                props.onShowSuccessSnackbar(true);
                props.onUpdateLibraryMap();
                // mapFloorRef.current.value = '';
                // mapNameRef.current.value = '';
                setValue("mapName", '');
                setValue("floorName", '');
                setInputKey(inputKey + 1);
            }).catch(err => {
                console.log(err);
                props.onShowErrorSnackbar(true);
            });
        }
    }

    return (
        <div>
            <h2 className="textCenter" style={{marginBottom:10}}>Add New Map</h2>
            <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
                <Grid container direction="row" justify="center">
                    <Grid item xs={12} md={8}>
                        <TextField
                            label="Floor"
                            name="floor"
                            type="number"
                            inputRef={register({required: true})}
                            error={errors?.floor}
                            helperText={errors?.floor && "Invalid floor value"}
                            fullWidth
                            required
                            variant="outlined"
                            onChange={e => setMapFloor(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Grid container direction="row" justify="center" style={{marginTop: 10}}>
                    <Grid item xs={12} md={8}>
                        <TextField
                            label="Map name"
                            name="mapName"
                            inputRef={register({required: true})}
                            error={errors?.mapName}
                            helperText={errors?.mapName && "Invalid name value"}
                            fullWidth
                            required
                            variant="outlined"
                            onChange={e => setMapName(e.target.value)}
                        />
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <Grid container direction="row" justify="center">
                        <Grid item xs={12} md={8}>
                            <DropzoneArea
                                key={inputKey}
                                // acceptedFiles={['*']}
                                dropzoneText={"Drag and drop an library image here"}
                                onChange={(files) => setImageFile(files)}
                                filesLimit={1}
                                maxFileSize={1048576}
                                showAlerts={false}
                                showPreviews={true}
                                showPreviewsInDropzone={false}
                            />
                            <p style={{color:"red",display:'none'}} ref={fileHelperTextRef}>Select a file</p>
                        </Grid>
                    </Grid>
                </Box>
                <div className="flex-justify-center" style={{marginTop: 15}}>
                    <Button variant="contained"
                            color="primary" type="submit">
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};

UploadLibraryMapForm.propTypes = {
    onUpdateLibraryMap: PropTypes.func,
    onShowSuccessSnackbar: PropTypes.func,
    onShowErrorSnackbar: PropTypes.func,
};

export default UploadLibraryMapForm;