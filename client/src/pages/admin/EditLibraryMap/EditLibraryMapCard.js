import React, {lazy, Suspense, useRef, useState} from 'react';
import {CardActionArea, Grid, TextField} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import * as axios from "axios";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {Clear, Edit, Publish} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from 'prop-types';
import CustomModal from "../../../components/CustomModal";
import {useForm} from "react-hook-form";
import {BASE_URL} from "../../../constant/route.constant";
import NoBookImagePlaceholder from "../../../images/book-placeholder.jpg";

const ImageModal = lazy(() => import("../../../components/imageViewer/ImageModal"));


const EditLibraryMapCard = props => {
    const {libraryMaps} = props;
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedLibraryMap, setSelectedLibraryMap] = useState({});
    const {register, handleSubmit, watch, setValue, getValues, errors} = useForm();

    let imageModal = useRef(null);

    const openImageModal = (index) => {
        imageModal.current.open(index);
    };

    const onDeleteLibraryMap = (libraryMap) => {
        setSelectedLibraryMap(libraryMap);
        setOpenConfirmationDialog(true);
    };

    const onEditLibraryMap = (libraryMap) => {
        setSelectedLibraryMap(libraryMap);
        setOpenEditDialog(true);
    };

    const confirmRemoveMap = () => {
        setOpenConfirmationDialog(false);
        axios.post('library-maps/delete-library-map', {id: selectedLibraryMap.id}).then(result => {
            props.onShowSuccessSnackbar(true);
            props.onUpdateLibraryMap();
        }).catch(err => {
            props.onShowErrorSnackbar(true);
        });
    };

    const confirmEditMap = () => {
        setOpenConfirmationDialog(false);
        const data = getValues();
        axios.post('library-maps/update-library-map-detail', data).then(result => {
            props.onShowSuccessSnackbar(true);
            props.onUpdateLibraryMap();
            onCloseDialog();
        }).catch(err => {
            props.onShowErrorSnackbar(true);
        });
    };

    const onCloseDialog = () => {
        setSelectedLibraryMap({});
        setOpenConfirmationDialog(false);
        setOpenEditDialog(false);
    };

    const onChangeFile = (e, libraryMap) => {
        if (e.target.files) {
            const uploadedImageFile = e.target.files[0];
            const formData = new FormData();
            formData.append('file', uploadedImageFile);
            formData.append('floorName', libraryMap.floor_name);
            formData.append('name', libraryMap.name);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            axios.post('library-maps/update-library-map', formData, config).then(result => {
                props.onShowSuccessSnackbar(true);
                props.onUpdateLibraryMap();
            }).catch(err => {
                props.onShowErrorSnackbar(true);
            });
        }
    };


    const displayLibraryCard = (libraryMap, index, lastFloor) => {
        return (
            <Grid key={index} item xs={12} md={6}>
                <h2 >{lastFloor !== libraryMap.floor_name ? `Floor ${libraryMap.floor_name}` : ''}</h2>
                <Card>
                    <CardHeader title={libraryMap.name} action={
                        <div>

                            <Tooltip title="Edit" aria-label="Edit">
                                <IconButton aria-label="editLibraryFloor"
                                            onClick={() => onEditLibraryMap(libraryMap)}>
                                    <Edit/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" aria-label="delete">
                                <IconButton aria-label="deleteForever"
                                            onClick={() => onDeleteLibraryMap(libraryMap)}>
                                    <Clear/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    }/>
                    <CardActionArea onClick={() => openImageModal(index)}>
                        <CardMedia style={{
                            height: 0,
                            paddingTop: '56.25%',
                        }}
                                   image={BASE_URL + libraryMap.image_url}
                                   title={libraryMap.name}
                                   onError={(e) => {
                                       e.target.onerror = null;
                                       e.target.src = NoBookImagePlaceholder
                                   }}
                        />
                    </CardActionArea>
                    <CardActions>
                        <input
                            accept="image/*"
                            id={"raised-button-file-" + index}
                            name="file"
                            type="file"
                            style={{display: "none"}}
                            onChange={(e) => onChangeFile(e, libraryMap)}
                        />
                        <label htmlFor={"raised-button-file-" + index} style={{margin: "auto"}}>
                            <Button
                                startIcon={<Publish/>}
                                component="span"
                                variant="contained"
                                color="primary"

                            > Upload Image in png/jpg</Button>
                        </label>

                    </CardActions>
                </Card>
            </Grid>
        );
        // })
    };

    let lastFloorName = '-';

    return (
        <Box width="100%">
            {libraryMaps.length === 0 ? '' : (<h2 className="textCenter">Edit Library Map</h2>)}

            <Box p={1}>
                <Grid container direction="row" justify="center" spacing={4}>
                    {libraryMaps.map((libraryMap, index) => {
                        const libraryCard = displayLibraryCard(libraryMap, index, lastFloorName);
                        lastFloorName = libraryMap.floor_name;
                        return libraryCard;
                    })}
                </Grid>
            </Box>
            <Suspense fallback={<div>Loading...</div>}>
                <ImageModal
                    showPreview
                    showIndex
                    activeIndex={0}
                    images={libraryMaps.map(libraryMap => {
                        return {src: BASE_URL + libraryMap.image_url, title: libraryMap.name,}
                    })}
                    ref={imageModal}
                />
            </Suspense>

            <CustomModal
                showAlertModal={openConfirmationDialog}
                onSuccessButtonPressed={confirmRemoveMap}
                onCloseConfirmationModal={onCloseDialog}
                title={"Are you sure you want to delete the map?"}
                desc={"This operation cannot be undone"}
                confirmationText={"Delete"}
            />

            <CustomModal showAlertModal={openEditDialog}
                         title={"Edit Library Map"}
                         desc={
                             <form id="editLibraryMapForm" onSubmit={handleSubmit(confirmEditMap)} noValidate
                                   autoComplete="off">
                                 <TextField name="id"
                                            value={selectedLibraryMap.id}
                                            inputRef={register()}
                                            style={{display: "none"}}/>
                                 <Grid container direction="row" justify="center">
                                     <Grid item xs={12} md={8}>
                                         <TextField
                                             label="Floor"
                                             name="floorName"
                                             type="number"
                                             defaultValue={selectedLibraryMap?.floor_name}
                                             inputRef={register({required: true})}
                                             error={errors?.floorName}
                                             helperText={errors?.floorName && "Invalid floor value"}
                                             fullWidth
                                             required
                                             variant="outlined"
                                         />
                                     </Grid>
                                 </Grid>
                                 <Grid container direction="row" justify="center" style={{marginTop: 10}}>
                                     <Grid item xs={12} md={8}>
                                         <TextField
                                             label="Map name"
                                             name="name"
                                             defaultValue={selectedLibraryMap?.name}
                                             inputRef={register({required: true})}
                                             error={errors?.name}
                                             helperText={errors?.name && "Invalid name value"}
                                             fullWidth
                                             required
                                             variant="outlined"
                                         />
                                     </Grid>
                                 </Grid>
                             </form>
                         }
                         customActions={[
                             <Button onClick={onCloseDialog} color="warning">
                                 Close
                             </Button>,
                             <Button form="editLibraryMapForm" type="submit" color="primary">
                                 Submit
                             </Button>]}/>

        </Box>
    );
};

EditLibraryMapCard.propTypes = {
    libraryMaps: PropTypes.array,
    onShowSuccessSnackbar: PropTypes.func,
    onShowErrorSnackbar: PropTypes.func,
    onUpdateLibraryMap: PropTypes.func
};

export default EditLibraryMapCard;
