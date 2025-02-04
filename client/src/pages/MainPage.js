import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { AnimatePresence, motion } from 'framer-motion';
import InputBox from '../components/InputBox';
import LoadingAnimation from '../components/LoadingAnimation';
import { useNavigate } from 'react-router';
import {
  PROTOCOL_STATE_WAITING_TOKENS
} from '../utils/protocol'

const MotionBox = motion(Box);

function MainPage({models, brainRot, isLoading, setIsLoading, refreshSavedKbs, initiateProtocol, protState}) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const handleUrlSubmit = (url, modelIdx) => {
    setIsLoading(true);
    setError(null);
    initiateProtocol(url, null, modelIdx);
  };

  const handleFileSubmit = async (file, modelIdx) => {
    setIsLoading(true);
    setError(null);
    initiateProtocol(null, file, modelIdx);
  }

  useEffect(() => {
    if (protState === PROTOCOL_STATE_WAITING_TOKENS) {
      navigate("/result", { state: { idx: 0 }});
    }
  }, [protState]);

  return (
    <div>      
      <AnimatePresence mode="wait">
        {!isLoading && (
          <MotionBox
            key="input"
            className="url-input-container"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '80vh',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100vw'
            }}
          >
            <InputBox models={models} onSubmitURL={handleUrlSubmit} onSubmitFile={handleFileSubmit} />
            {error && (
              <Box sx={{ 
                position: 'relative',
                zIndex: 1,
                color: 'error.main',
                textAlign: 'center',
                mt: 2,
                p: 2,
                bgcolor: 'error.light',
                borderRadius: 1
              }}>
                {error}
              </Box>
            )}
          </MotionBox>
        )}
        {isLoading && (
          <MotionBox
            key="loading"
            className="loading-animation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            sx={{
              position: 'relative',
              zIndex: 1
            }}
          >
            <LoadingAnimation brainRot={brainRot} protState={protState}/>
          </MotionBox>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainPage;