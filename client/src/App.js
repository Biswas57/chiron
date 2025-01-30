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
import Game from "./pages/Game"
import { getAllKBfromLocalStorage } from './utils/localStorage';

function App() {
  // This needs to be a global state to disable the navbar during AI generation
  // Navigating during generation leads to a bunch of weirdness.
  const [isLoading, setIsLoading] = useState(false);

  const [brainRot, setBrainRot] = useState(false);
  const [theme, setTheme] = useState(themes.default);
  useEffect(() => {
    setTheme(brainRot ? themes.brainrot : themes.default);
  }, [brainRot]);

  const [savedKbs, setSavedKbs] = React.useState(getAllKBfromLocalStorage());
  const refreshSavedKbs = () => {
    setSavedKbs(getAllKBfromLocalStorage());
  }

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
          <Navbar
            brainRot={brainRot}
            setBrainRot={setBrainRot}
            isLoading={isLoading}
            savedKbs={savedKbs}
            refreshSavedKbs={refreshSavedKbs}
          />

          {/* {brainRot ? <VideoBackground /> : <NutanixBirds />} */}

          {/* Page content */}
          <Routes>
            <Route path="/" element={<MainPage brainRot={brainRot} isLoading={isLoading} setIsLoading={setIsLoading} refreshSavedKbs={refreshSavedKbs} />} />
            <Route path="/result" element={<ScriptBox brainRot={brainRot} refreshSavedKbs={refreshSavedKbs} />} />
            <Route path="/game" element={<Game />} />
          </Routes>

        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;