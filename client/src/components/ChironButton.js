import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import '@fontsource/anta';
import '@fontsource/audiowide';
import '@fontsource/bruno-ace-sc';

const ChironButton = ({ isLoading, editing, setErrorMessage, setErrorModalOpen, navigate }) => {
  return (
    <Button
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        if (isLoading) {
          setErrorMessage("You cannot navigate to a different page while the script is generating.");
          setErrorModalOpen(true);
        } else if (editing) {
          setErrorMessage("You are in editing mode, you will lose your changes if you navigate away. Save your work first!");
          setErrorModalOpen(true);
        } else {
          navigate('/');
        }
      }}
      sx={{
        fontSize: '1.8rem',
        fontWeight: 500,
        letterSpacing: '0.03em',
        textTransform: 'none',
        padding: '0.3rem 1rem',
        background: 'transparent',
        color: 'white',
        transition: 'all 0.2s ease',
        fontFamily: 'Open Sans, Montserrat, sans-serif',
        opacity: 0.9,
        
        '&:hover': {
          background: 'transparent',
          opacity: 1
        }
      }}
    >
      Chiron
    </Button>
  );
};

export default ChironButton;