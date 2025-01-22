import React from 'react';
import { SyncLoader } from 'react-spinners';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';

const LoadingAnimation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          color: 'white',
          gap: 4
        }}
      >
        <Box
          sx={{
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(120,85,251,0.15) 0%, rgba(0,0,0,0) 70%)',
              filter: 'blur(8px)',
              zIndex: -1
            }
          }}
        >
          <SyncLoader 
            color="#7855fb"
            size={15}
            speedMultiplier={0.9}
            cssOverride={{
              filter: 'drop-shadow(0 0 10px rgba(120,85,251,0.3))'
            }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box
            sx={{
              typography: 'h6',
              color: 'grey.100',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              mb: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.4)'
            }}
          >
            Processing your article
          </Box>
          <Box
            sx={{
              color: 'grey.300',
              fontSize: '0.9rem',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              textShadow: '0 1px 3px rgba(0,0,0,0.4), 0 0 1px rgba(0,0,0,0.3)'
            }}
          >
            This may take a few minutes...
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default LoadingAnimation;