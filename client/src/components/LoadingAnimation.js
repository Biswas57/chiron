import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { SyncLoader } from 'react-spinners';
import brainRotGif from '../assets/brainrot/loading.gif'
import {
  PROTOCOL_STATE_WAITING_FOR_METADATA,
  PROTOCOL_STATE_WAITING_FIRST_TOKEN,
} from '../utils/protocol';

const LoadingMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    <Typography
      variant="h6"
      sx={{
        fontFamily: 'inherit',
        textAlign: 'center',
        color: 'grey.100',
        mb: 1,
        fontWeight: 500,
      }}
    >
      {message}
    </Typography>
  </motion.div>
);

const nthNumber = (number) => {
  if (number > 3 && number < 21) return number.toString() + "th";
  switch (number % 10) {
    case 1:
      return number.toString() + "st";
    case 2:
      return number.toString() + "nd";
    case 3:
      return number.toString() + "rd";
    default:
      return number.toString() + "th";
  }
};

const LoadingAnimation = ({ brainRot, protState, queuePos }) => {
  const getMessage = () => {
    switch (protState) {
      case PROTOCOL_STATE_WAITING_FOR_METADATA:
        return "Scraping your article...";
      case PROTOCOL_STATE_WAITING_FIRST_TOKEN:
        return "Scraped article, piped into LLM, waiting for first token...";
      case PROTOCOL_STATE_QUEUEING:
        return "You are " + nthNumber(queuePos) + " in the queue."
      default:
        return "Loading...";
    }
  };

  if (brainRot) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        sx={{
          height: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Comic Sans MS',
            textAlign: 'center',
            color: 'grey.100',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
          }}
        >
          {getMessage()}
        </Typography>
        <img src={brainRotGif} alt="loading..." />
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      sx={{
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
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
            background: (theme) => `radial-gradient(circle, ${theme.palette.primary.main}22 0%, transparent 70%)`,
            filter: 'blur(8px)',
            zIndex: -1
          }
        }}
      >
        <SyncLoader 
          color="#7855fb"
          size={15}
          speedMultiplier={0.8}
        />
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <AnimatePresence mode="wait">
          <LoadingMessage key={getMessage()} message={getMessage()} />
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'grey.400',
              mt: 2,
              fontWeight: 300,
            }}
          >
            This may take a few moments
          </Typography>
        </motion.div>
      </Box>
    </Box>
  );
};

export default LoadingAnimation;
