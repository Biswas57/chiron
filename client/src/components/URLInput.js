import React, { useState, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import { Box, Typography, Paper, Button } from '@mui/material';
import { Divider } from '@mui/material';
import { useDropzone } from 'react-dropzone';

const InputBox = ({ onSubmitURL, onSubmitFile }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(false);

  const urlPattern = /^https:\/\/portal\.nutanix\.com\//;

  const handleSubmitURL = (e) => {
    e.preventDefault();
    if (urlPattern.test(url.trim())) {
      setError(false);
      onSubmitURL(url);
    } else {
      setError(true);
    }
  };

  // File dropzone state
  const onDrop = useCallback((acceptedFiles) => {
    const fname = acceptedFiles[0].name;
    const fname_split = fname.split('.');
    if (fname_split.length > 0) {
      if (fname_split.pop().toLowerCase() === "pdf") {
        setFileObj(acceptedFiles[0]);
        return;
      }
    }
    
    alert("File must be a PDF that ends in '.pdf' or '.PDF'")
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false, // only 1 file acceptable
  });
  // Uploaded file state
  const [fileObj, setFileObj] = useState(null);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        background: 'grey',
        width: '500px',
        padding: '20px'
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmitURL}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: '100%',
        }}
      >
        <TextField
          label="Enter KB Article URL"
          variant="filled"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={error}
          helperText={error ? 'URL must be from the Nutanix portal.' : ''}
          color="primary"
          autoComplete="off"
          inputProps={{
            autoComplete: 'off',
          }}
          sx={{
            borderRadius: '4px',
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#7855fb',
              },
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: '#7855fb',
            '&:hover': {
              backgroundColor: '#5b3ecc',
            },
          }}
        >
          Submit
        </Button>
      </Box>

      <Divider 
        sx={{
          width: '100%',
          margin: '10px'
        }}
      />

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Paper
          {...getRootProps()}
          sx={{
            border: '2px dashed #7855fb',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 3,
            textAlign: 'center',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="body1" color="textSecondary">
            {fileObj === null ? "Or drag n' drop a KB article PDF" : ("Captured: " + fileObj.name)}
          </Typography>
        </Paper>

        <Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: '#7855fb',
              '&:hover': {
                backgroundColor: '#5b3ecc',
              },
              width: '100px',
              marginTop: '15px',
              marginRight: '5px'
            }}
            onClick={() => {onSubmitFile(fileObj)}}
            disabled={fileObj === null}
          >
            Upload
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: '#7855fb',
              '&:hover': {
                backgroundColor: '#5b3ecc',
              },
              width: '100px',
              marginTop: '15px',
              marginLeft: '5px'
            }}
            onClick={() => {setFileObj(null)}}
            disabled={fileObj === null}
          >
            Discard
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InputBox;
