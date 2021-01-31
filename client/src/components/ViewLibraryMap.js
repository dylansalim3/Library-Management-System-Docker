import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import Box from "@material-ui/core/Box";
import {CardActionArea, Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import PropTypes from "prop-types";
import EditLibraryMapCard from "../pages/admin/EditLibraryMap/EditLibraryMapCard";
import * as axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import {BASE_URL} from "../constant/route.constant";
import NoBookImagePlaceholder from "../images/book-placeholder.jpg";

const ImageModal = lazy(() => import("./imageViewer/ImageModal"));

const ViewLibraryMap = () => {
    const [libraryMaps, setLibraryMaps] = useState([]);
    const [loading, setLoading] = useState(true);


    // const loading = libraryMaps.length === 0;

    useEffect(() => {
        if (!loading) {
            return undefined;
        }
        getLibraryMaps();
    }, [loading]);

    const getLibraryMaps = () => {
        axios.get('library-maps/get-library-maps').then(result => {
            setLibraryMaps(result.data);
            setLoading(false);
        }).catch(err => {
            console.log(err.toString());
        })
    };

    let imageModal = useRef(null);

    const openImageModal = (index) => {
        imageModal.current.open(index);
    };

    return !loading ? (
        <Box width="100%">
            <h2 className="textCenter">{libraryMaps.length === 0 ? 'No Library Map found' : 'Library Map'}</h2>
            <Box p={1}>
                <Box>
                    {/*<h3>{`Floor ${libraryMap.floor.toString()}`}</h3>*/}
                    <Grid container direction="row" justify="center" spacing={4}>
                        {libraryMaps.map((libraryMap, index) => {
                            return (
                                <Grid key={libraryMap.id} item xs={12} md={6}>
                                    <Card>
                                        <CardHeader title={`Floor ${libraryMap.floor_name} - ` +libraryMap.name}/>
                                        <CardActionArea onClick={() => openImageModal(index)}>
                                            <CardMedia style={{
                                                height: 0,
                                                paddingTop: '56.25%',
                                            }} image={BASE_URL + libraryMap.image_url}
                                                       title={libraryMap.name}
                                                       onError={(e)=>{e.target.onerror = null; e.target.src=NoBookImagePlaceholder}}/>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>


            </Box>
            <Suspense fallback={<div className="textCenter">Loading...</div>}>
                <ImageModal
                    showPreview
                    showIndex
                    activeIndex={0}
                    images={libraryMaps.map(libraryMap => {
                        return {src: BASE_URL + libraryMap.image_url, title: libraryMap.name,}
                    })}
                    ref={imageModal}/>
            </Suspense>

        </Box>) : <Box width="100%" display="flex" justifyContent="center">
        <CircularProgress color="inherit" size={20}/>
    </Box>;

    // );
}

EditLibraryMapCard.propTypes = {
    libraryMaps: PropTypes.array,
};

export default ViewLibraryMap;
