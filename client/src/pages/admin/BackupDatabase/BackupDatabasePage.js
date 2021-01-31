import React, {useRef, useState} from 'react';
import AdminBoilerplate from "../AdminBoilerplate";
import {Grid, Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import {DropzoneArea} from "material-ui-dropzone";
import * as axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const BackupDatabasePage = () => {
    const [SQLFile, setSQLFile] = useState(null);
    const [inputKey, setInputKey] = useState(1);
    const [openErrorSnackbar, setOpenErrorSnackbar] = React.useState(false);
    const [openSuccessSnackbar, setOpenSuccessSnackbar] = React.useState(false);
    const fileHelperTextRef = useRef(null);

    const backupData = () => {
        axios({url: 'backup-database/backup-data', method: 'POST'}).then(response => {
            if (response.data?.download !== undefined) {
                setTimeout(() => {
                    window.open(response.data?.download);
                }, 100
                )
            }
            // const url = window.URL.createObjectURL(new Blob([response.data]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', 'backup.zip');
            // document.body.appendChild(link);
            // link.click();
        }).catch(err => {
            setOpenErrorSnackbar(true);
        });
    }


    const validateForm = () => {
        if (SQLFile.length === 0) {
            fileHelperTextRef.current.style.display = "inline-block";
            return false;
        }
        return true;
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const validated = validateForm();
        if (validated) {
            const formData = new FormData();
            formData.append('file', SQLFile[0]);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            axios.post('backup-database/restore-data', formData, config).then(result => {
                setOpenSuccessSnackbar(true);
                setInputKey(inputKey + 1);
            }).catch(err => {
                setOpenErrorSnackbar(true);
            });
        }
    }
    return (
        <div>
            <AdminBoilerplate page={'backup_data'}/>
            <div className="content">
                <Paper style={{padding: 20}}>
                    <h2 className="textCenter">One-click Database Backup</h2>
                    <div className="flex-justify-center" style={{marginTop: 10,marginBottom: 5}}>
                        <Button color="primary" variant="contained" onClick={backupData}>Download Backup Data</Button>
                    </div>
                    <p className="textCenter" style={{marginBottom: 20}}>Click the above button to download database backup in SQL Format</p>

                    <h2 className="textCenter">Database Restore</h2>
                    <form onSubmit={onSubmit} noValidate autoComplete="off">

                        <Box mt={2}>
                            <Grid container direction="row" justify="center">
                                <Grid item xs={12} md={8}>
                                    <DropzoneArea
                                        key={inputKey}
                                        // acceptedFiles={['application/x-sql','text/octet-stream','application/sql','file' ,'text/sql', 'text/x-sql', 'text/plain'] }
                                        dropzoneText={"Drag and drop the SQL file here"}
                                        onChange={(files) => {
                                            setSQLFile(files)
                                        }}
                                        filesLimit={1}
                                        maxFileSize={104857600}
                                        showAlerts={false}
                                        showPreviews={true}
                                        showPreviewsInDropzone={false}
                                    />
                                    <p style={{color: "red", display: 'none'}} ref={fileHelperTextRef}>Select a file</p>
                                    <p>* This operation will wiped out all the existing user and its associated data!</p>
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
                </Paper>

                <Snackbar open={openErrorSnackbar} autoHideDuration={3000} onClose={() => {
                    setOpenErrorSnackbar(false)
                }}>
                    <Alert onClose={() => {
                        setOpenErrorSnackbar(false)
                    }} severity="error">
                        An Error occurred. Please try again later
                    </Alert>
                </Snackbar>

                <Snackbar open={openSuccessSnackbar} autoHideDuration={3000} onClose={() => {
                    setOpenSuccessSnackbar(false)
                }}>
                    <Alert onClose={() => {
                        setOpenSuccessSnackbar(false)
                    }} severity="success">
                        Database Restore Successful
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
};

export default BackupDatabasePage;