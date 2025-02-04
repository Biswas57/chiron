import React from 'react';
import { SyncLoader } from 'react-spinners';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import brainRotGif from '../assets/brainrot/loading.gif'
import {
  PROTOCOL_STATE_WAITING_FOR_METADATA,
  PROTOCOL_STATE_WAITING_FIRST_TOKEN,
} from '../utils/protocol'

function loadingStatus(protState) {
  if (protState == PROTOCOL_STATE_WAITING_FOR_METADATA) {
    return (
      <div>
        Scraping your article...
      </div>
    )
  } else if (protState == PROTOCOL_STATE_WAITING_FIRST_TOKEN) {
    return (
      <div>
        Scraped article, piped into LLM, waiting for first token...
      </div>
    )
  }
}

const LoadingAnimation = ({brainRot, protState}) => {
  if (brainRot) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          color: 'white',
          gap: 4,
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
          {loadingStatus(protState)}
        </Box>
        <img src={brainRotGif} alt="loading..." />
      </Box>
    )
  } else {
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
              speedMultiplier={1}
              // cssOverride={{
              //   filter: 'drop-shadow(0 0 10px rgba(120,85,251,0.2))'
              // }}
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
                // textShadow: '0 30px 30px rgba(0,0,0,1), 0 30px 30px rgba(0,0,0,1)'
              }}
            >
              {loadingStatus(protState)}
            </Box>
            <Box
              sx={{
                color: 'grey.300',
                fontSize: '0.9rem',
                fontFamily: 'Inter, sans-serif',
                textAlign: 'center',
                // textShadow: '0 30px 30px rgba(0,0,0,1), 0 30px 30px rgba(0,0,0,1)'
              }}
            >
              This may take a few minutes...
            </Box>
          </Box>
        </Box>
      </motion.div>
    );
  }
};

export default LoadingAnimation;