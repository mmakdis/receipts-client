import logo from './logo.svg';
import './App.css';
import axios from 'axios';
// import React, {useState} from 'react';
import Button from '@mui/material/Button';
import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green, red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import Fab from '@mui/material/Fab';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import UploadIcon from '@mui/icons-material/Upload';
import CameraIcon from '@mui/icons-material/CameraAlt'
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import ReactJson from 'react-json-view';
import Typography from '@mui/material/Typography';
import reactDom from 'react-dom';

const Input = styled('input')({
  display: 'none',
});
  
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

function App() {
  const [selectedFile, setSelectedFile] = React.useState();
  const [isFilePicked, setIsFilePicked] = React.useState(false);
  const [output, setOutput] = React.useState({});
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [failure, setFailure] = React.useState(false);
  const [enhance, setEnhance] = React.useState(false);
  const timer = React.useRef();

  const Pretty = React.memo(({data}) => (<div><pre>{ JSON.stringify(data, null, 4) }</pre></div>));

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  }

  const enhanceSwitchHandler = (event) => {
    setEnhance(!enhance);
  }

  const buttonSx = {
    ...(success && {
        bgcolor: green[500],
        '&:hover': {
        bgcolor: green[700],
        },
      }),
    ...(failure && {
        bgcolor: red[500],
        '&:hover': {
        bgcolor: red[700],
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
      setFailure(false);
      setLoading(true);
      //timer.current = window.setTimeout(() => {
      // }, 2000);
      const formData = new FormData();
      formData.append("file", selectedFile);
      // 10.52.8.63:8000
      // 192.168.1.208:8000
      axios.post(`http://10.52.8.63:8000/api/receipt/upload/?enhance=${enhance}`, formData).then(function (response) {
          setIsLoaded(true);
          setLoading(false);
          setOutput(response.data);
          if ('detail' in response.data) {
            setFailure(true);
            setSuccess(false);
          }
          else {
            setFailure(false);
            setSuccess(true);
          }
      })
      .catch(function (error) {
          console.log(error);
          setFailure(true);
          setIsLoaded(true);
      })
      .then(function() {
      });
  }
  }
  
  return (
    <div className="App">
    <header className="App-header">
      <h1>🍺</h1>
      <div>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Fab aria-label="upload" color="primary" sx={buttonSx} onClick={handleSubmission}>
            {success ? <CheckIcon /> : failure ? <CloseIcon /> : <UploadIcon />}
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
          </Fab>
        </Box>
        <Box sx={{ m: 1, position: 'relative' }}>
          <label htmlFor="icon-button-file">
            <Input accept="image/*" id="icon-button-file" type="file" onChange={changeHandler} hidden/>
            <Fab color="primary" aria-label="upload picture" component="span" >
                <CameraIcon />
            </Fab>
          </label>
        </Box>
        <FormControlLabel
            control={<IOSSwitch sx={{ m: 1 }} />}
            label="Enhance"
            onChange={enhanceSwitchHandler}
        />
        <br></br>
        <div className="App-body">
            <Box sx={{ m: 1, position: 'relative' }}>
                <ReactJson theme="monokai" src={output}/>
            </Box>
        </div>
        <br></br>
      </div>
    </header>
    </div>
    )
}

export default App;
