import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ntxLogo from '../assets/nutanix.svg';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary" sx={{ boxShadow: '0 10px 8px rgba(0, 0, 0, 0.5)' }}>
      <Toolbar>
      <Typography
        color="primary"
        variant="h6"
        component="div"
        sx={{
            flexGrow: 1,
            fontSize: '1.4rem',
            fontWeight: 'bold',
            textShadow: `
            0 0 25px rgba(255, 255, 255, 0.35)
            `,
        }}
        >
        Chiron Framework
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={ntxLogo} alt="Nutanix Logo" style={{ height: 20, width: 'auto' }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;