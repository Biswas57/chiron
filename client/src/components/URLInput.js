import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const InputBox = ({ onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (url.trim()) {
      onSubmit(url);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh', // Ensure the box takes the full height of the screen
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          maxWidth: '500px', // Maximum width for input box
        }}
      >
        <TextField
          label="Enter KB Article URL"
          variant="filled"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          color="primary"
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            width: '100%', // Ensures the input takes up the full width of the container
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#7855fb',
              },
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
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
    </Box>
  );
};

export default InputBox;
