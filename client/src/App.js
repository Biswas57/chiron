import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { AnimatePresence, motion } from 'framer-motion';
import InputBox from './components/URLInput';
import LoadingAnimation from './components/LoadingAnimation';
import ScriptBox from "./components/ScriptBox";

const MotionBox = motion(Box);

const API_URL = 'http://localhost:5000/api/extract-text';

function App() {
  const [showScript, setShowScript] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptText, setScriptText] = useState("");
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
        setScriptText(data.data);
        setShowScript(true);
      } else {
        throw new Error(data.error || 'Failed to extract text');
      }
    } catch (error) {
      console.error('Error fetching script:', error);
      setError(error.message);
      // You might want to show this error to the user
      setShowScript(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <AnimatePresence mode="wait">
          {!showScript && !isLoading && (
            <MotionBox
              key="input"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InputBox onSubmit={handleUrlSubmit} />
              {error && (
                <Box sx={{ 
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingAnimation />
            </MotionBox>
          )}
          {showScript && !isLoading && (
            <MotionBox
              key="script"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ScriptBox scriptText={scriptText} />
            </MotionBox>
          )}
        </AnimatePresence>

  );
}

export default App;