import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { AnimatePresence, motion } from 'framer-motion';
import InputBox from '../components/URLInput';
import LoadingAnimation from '../components/LoadingAnimation';
import { useNavigate } from 'react-router';
import { addKBtoLocalStorage } from '../utils/localStorage';

const MotionBox = motion(Box);

const API_URL = 'http://localhost:5000/api/extract-text';

function MainPage({brainRot, isLoading, setIsLoading, refreshSavedKbs}) {
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const handleUrlSubmit = async (url) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        addKBtoLocalStorage(data.kb_id, data.title, data.data);
        refreshSavedKbs();
        navigate("/result", { state: { idx: 0, scriptText: data.data } });
      } else {
        throw new Error(data.error || 'Failed to extract text');
      }
    } catch (error) {
      console.error('Error fetching script:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>      
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
              zIndex: 1
            }}
          >
            <InputBox onSubmit={handleUrlSubmit} />
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
            <LoadingAnimation brainRot={brainRot}/>
          </MotionBox>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainPage;