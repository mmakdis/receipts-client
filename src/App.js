import logo from './logo.svg';
import './App.css';
import axios from 'axios';
// import React, {useState} from 'react';
import Button from '@mui/material/Button';
import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import UploadIcon from '@mui/icons-material/Upload';
import ReactJson from 'react-json-view';


function App() {
    const [selectedFile, setSelectedFile] = React.useState();
    const [isFilePicked, setIsFilePicked] = React.useState(false);
    const [output, setOutput] = React.useState({});
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const timer = React.useRef();

    const Pretty = React.memo(({data}) => (<div><pre>{
        JSON.stringify(data, null, 4) }</pre></div>));

    const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
    }

    const buttonSx = {
    ...(success && {
        bgcolor: green[500],
        '&:hover': {
        bgcolor: green[700],
        },
    }),
    };

    React.useEffect(() => {
    return () => {
        clearTimeout(timer.current);
    };
    }, []);


    const handleSubmission = () => {
    if (!loading) {
        setSuccess(false);
        setLoading(true);
        //timer.current = window.setTimeout(() => {
        // }, 2000);
        const formData = new FormData();
        formData.append("file", selectedFile);
        axios.post("http://0.0.0.0:8000/api/receipt/upload/", formData).then(function (response) {
            setIsLoaded(true);
            setSuccess(true);
            setLoading(false);
            setOutput(response.data);
        })
        .catch(function (error) {
            console.log(error);
            setIsLoaded(true);
        })
        .then(function() {
        });
    }
    }

    console.log(output);

    return (
        <div className="App">
        <header className="App-header">
            <h1>🍺</h1>
            <Box sx={{ m: 1, position: 'relative' }}>
                <Fab
                aria-label="upload"
                color="primary"
                sx={buttonSx}
                onClick={handleSubmission}
                >
                {success ? <CheckIcon /> : <UploadIcon />}
                </Fab>
                {loading && (
                    <CircularProgress
                        size={68}
                        sx={{
                        color: green[500],
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        zIndex: 1,
                        }}
                    />
                )}
            </Box>
            <div>
                <Button
                    variant="contained"
                    component="label">
                    Choose Receipt
                    <input type="file" name="file" onChange={changeHandler} hidden/>
                </Button>
                <br></br>
                <div class="App-body">
                    <Box sx={{ m: 1, position: 'relative' }}>
                        <ReactJson theme="monokai" src={output}/>
                        {/* <p>Products: {JSON.stringify(output['products'], null, 4)}</p> */}
                    </Box>
                </div>
                <br></br>
            </div>
        </header>
        </div>
    )
}

export default App;
