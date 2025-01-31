import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { AlertCircle } from 'lucide-react';

const ErrorModal = ({ open, onClose, message }) => (
  <Modal
    open={open}
    onClose={onClose}
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Box
      sx={{
        background: 'rgba(4, 4, 4, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}
    >
      <AlertCircle size={32} color="#ff4d4d" />
      <Typography 
        variant="h6" 
        sx={{ 
          color: 'text.primary',
          textAlign: 'center',
          fontWeight: 600
        }}
      >
        Error
      </Typography>
      <Typography 
        sx={{ 
          color: 'text.secondary',
          textAlign: 'center',
          mb: 2
        }}
      >
        {message}
      </Typography>
      <Button
        variant="contained"
        onClick={onClose}
        sx={{
          backgroundColor: '#7855fb',
          padding: '8px 24px',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#5b3ecc',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s ease-in-out',
        }}
      >
        Close
      </Button>
    </Box>
  </Modal>
);

export default ErrorModal;