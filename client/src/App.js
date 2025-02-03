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
import InstructionPage from "./pages/InstructionPage"
import Game from "./pages/Game"
import { getAllKBfromLocalStorage } from './utils/localStorage';
import io from 'socket.io-client';
import { Typography } from '@mui/material';

const API_URL = 'http://localhost:4200/';

let socket = null;
const SOCKET_CONNECTING = 0;
const SOCKET_CONNECTED = 1;
const SOCKET_ERROR = 2;

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

  // Server connection status.
  const [connection, setConnection] = useState(SOCKET_CONNECTING);

  // TODO: clicking back still triggers a navigation during edit mode. Need to fix
  useEffect(() => {
    // Prevent navigation during generation
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

    // Open a socket to the server
    socket = io(API_URL, {
      transports: ['websocket'],
    });

    socket.on('connect_error', () => {
      setConnection(SOCKET_ERROR);
    });

    socket.on('connect', () => {
      setConnection(SOCKET_CONNECTED);
    });

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBrowserNavigation);
      socket.disconnect();
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
          { connection === SOCKET_CONNECTED ? (
            <Routes className="url-input-container">
              <Route path="/" element={
                <MainPage
                  brainRot={brainRot}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  refreshSavedKbs={refreshSavedKbs}
                  socket={socket}
                />
              }/>
              <Route path="/result" element={
                <ScriptBox
                  brainRot={brainRot}
                  refreshSavedKbs={refreshSavedKbs}
                  editing={editing}
                  setEditing={setEditing}
                  socket={socket}
                />
              }/>
              <Route path="/game" element={<Game />} />
              <Route path="/instructions" element={<InstructionPage/>} />
            </Routes>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              { connection === SOCKET_ERROR ? (                  
                <Typography
                  sx={{
                    fontSize: '200%'
                  }}
                >
                  Cannot connect to server, reattempting connection in backgroun. In the meantime you can only view previous generations.
                </Typography>
              ) : (
                <Typography
                  sx={{
                    fontSize: '200%'
                  }}
                >
                  Connecting to server...
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;