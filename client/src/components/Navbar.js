import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ntxLogo from '../assets/nutanix.svg';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary" 
      sx={{
        boxShadow: '0 10px 8px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Button
          color="primary"
          variant="text"
          component="div"
          sx={{
              fontSize: '1.4rem',
              fontWeight: 'bold',
              textShadow: `0 0 25px rgba(255, 255, 255, 0.35)`,    
          }}
          onClick={() => {window.location.reload();}}
        >
          Chiron Framework
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={ntxLogo} alt="Nutanix Logo" style={{ height: 20, width: 'auto' }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;