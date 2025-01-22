import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const URLInput = ({ onSubmit }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url);
      setUrl('');
    }
  };

  return (
    <Box
      component="form"
      sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      onSubmit={handleSubmit}
    >
      <TextField
        label="Enter KB Article URL"
        variant="outlined"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        sx={{ width: '60%', mb: 2 }}
      />
      <Button type="submit" variant="contained" color="primary">
        Generate Script
      </Button>
    </Box>
  );
};

export default URLInput;
