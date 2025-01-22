import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navbar from './components/Navbar';
import InputBox from './components/URLInput';
import theme from './Theme';
import VideoBackground from './components/VideoBackground';
import ParticlesBackground from "./ParticlesBackground";

function App() {
  const handleUrlSubmit = (url) => {
    console.log('Submitted URL:', url);
    // Add your backend API call here
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          backgroundColor: 'transparent'
        }}
      >
        <VideoBackground />
        <Navbar />
        <InputBox onSubmit={handleUrlSubmit} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
