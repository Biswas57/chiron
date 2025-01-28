import React from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function InstructionModal() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'gray',
        boxShadow: 24,
        padding: 4,
        borderRadius: 2,
        width: '400px',
      }}
    >
      <Typography
        sx={{
          textAlign: 'center'
        }}
      >
        Instructions
      </Typography>
    </Box>
  )
}

export default InstructionModal;