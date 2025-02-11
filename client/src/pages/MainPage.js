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

function MainPage({ models, brainRot, isLoading, setIsLoading, initiateProtocol, protState, queuePos }) {
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
      navigate("/result", { state: { idx: 0 } });
    }
  }, [protState]);

  return (
    <Box
      component="div"
      sx={{
        width: '100%',
        minHeight: '500px',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >      
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
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <InputBox models={models} onSubmitURL={handleUrlSubmit} onSubmitFile={handleFileSubmit} setHttpErrorMsg={setError} />
            {error && (
              <Box sx={{
                position: 'relative',
                zIndex: 1,
                color: 'error.main',
                backdropFilter: 'blur(5px)',
                textAlign: 'center',
                border: '1px solid red',
                mt: 2,
                p: 2,
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
              zIndex: 1,
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <LoadingAnimation brainRot={brainRot} protState={protState} queuePos={queuePos} />
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default MainPage;