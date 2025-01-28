import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import ScriptBox from "./pages/ScriptBox";
import themes from './Theme';
import NutanixBirds from "./nutanixBirds"
import VideoBackground from "./components/VideoBackground"

function App() {
  const [brainRot, setBrainRot] = useState(false);

  const [theme, setTheme] = useState(themes.default);
  useEffect(() => {
    setTheme(brainRot ? themes.brainrot : themes.default);
  }, [brainRot]);

  return (  
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            position: 'relative',
            backgroundColor: 'transparent'
          }}
        >
          {/* These appear on all pages */}
          <Navbar brainRot={brainRot} setBrainRot={setBrainRot} />

          {brainRot ? <VideoBackground /> : <NutanixBirds />}

          {/* Page content */}
          <Routes>
            <Route path="/" element={<MainPage brainRot={brainRot} />} />
            <Route path="/result" element={<ScriptBox brainRot={brainRot} />} />
          </Routes>

        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;