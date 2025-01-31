import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ open, onClose, message, onConfirm }) => (
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
      <AlertTriangle size={32} color="#ffd700" />
      <Typography 
        variant="h6" 
        sx={{ 
          color: 'text.primary',
          textAlign: 'center',
          fontWeight: 600
        }}
      >
        Confirm Action
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
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={onConfirm}
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
          Confirm
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: '#7855fb',
            color: '#7855fb',
            padding: '8px 24px',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#5b3ecc',
              backgroundColor: 'rgba(120, 85, 251, 0.1)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  </Modal>
);

export default ConfirmModal;