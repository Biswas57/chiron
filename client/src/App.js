import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import ScriptBox from "./pages/ScriptBox";
import themes from './Theme';
import NutanixBirds from "./nutanixBirds"
import VideoBackground from "./components/VideoBackground"
import InstructionPage from "./pages/InstructionPage"
import Game from "./pages/Game"
import { getAllKBfromLocalStorage } from './utils/localStorage';

function App() {
  // Technical TODO: this is a lot of global states, better if we use something 
  // like MobX to manage states.

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

  // Global state to disable navigation during edit mode
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (editing) {
        event.preventDefault();
        event.returnValue = "You are in editing mode, you will lose your changes if you close this page. Are you sure?";
      }
    };

    const handleBrowserNavigation = (event) => {
      if (editing) {
        console.log("back");
        event.preventDefault();
        event.returnValue = "You are in editing mode, you will lose your changes if you close this page. Are you sure?";
      }
    };

    if (editing) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handleBrowserNavigation);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBrowserNavigation);
    }

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBrowserNavigation);
    };
  }, [editing])

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            minHeight: '100vh',
            position: 'relative',
            backgroundColor: 'transparent',
            position: 'relative'
          }}
        >
          {/* These appear on all pages */}
          <Navbar
            brainRot={brainRot}
            setBrainRot={setBrainRot}
            isLoading={isLoading}
            savedKbs={savedKbs}
            refreshSavedKbs={refreshSavedKbs}
            editing={editing}
          />

          {brainRot ? <VideoBackground /> : <NutanixBirds />}

          {/* Page content */}
          <Routes className="url-input-container">
            <Route path="/" element={
              <MainPage
                brainRot={brainRot}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                refreshSavedKbs={refreshSavedKbs}
              />
            }/>
            <Route path="/result" element={
              <ScriptBox
                brainRot={brainRot}
                refreshSavedKbs={refreshSavedKbs}
                editing={editing}
                setEditing={setEditing}
              />
            }/>
            <Route path="/game" element={<Game />} />
            <Route path="/instructions" element={<InstructionPage/>} />
          </Routes>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;