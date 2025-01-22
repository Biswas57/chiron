import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const InputBox = ({ onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`clicked! URL: ${url}`)
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
        height: '80vh',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          maxWidth: '500px',
        }}
      >
        <TextField
          label="Enter KB Article URL"
          variant="filled"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          color="primary"
          autoComplete="off"
          inputProps={{
            autoComplete: 'off',
          }}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            width: '100%',
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
    </Box>
  );
};

export default InputBox;