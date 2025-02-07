import React, { useState, useEffect, useRef } from 'react';
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
import { addKBtoLocalStorage, getAllKBfromLocalStorage } from './utils/localStorage';
import io from 'socket.io-client';
import { Typography, CircularProgress, Paper } from '@mui/material';
import { WifiOff } from 'lucide-react';
import {
  PROTOCOL_STATE_IDLE,
  PROTOCOL_STATE_WAITING_FOR_METADATA,
  PROTOCOL_STATE_METADATA_RECV,
  PROTOCOL_STATE_WAITING_FIRST_TOKEN,
  PROTOCOL_STATE_WAITING_TOKENS
} from './utils/protocol'


const API_URL = 'http://10.134.83.201:6969/';

let socket = null;
const SOCKET_CONNECTING = 0;
const SOCKET_CONNECTED = 1;
const SOCKET_ERROR = 2;

function ConnectionStatus({ status }) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          padding: '32px',
          background: 'rgba(4, 4, 4, 0.1)',
          backdropFilter: 'blur(5px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '540px',
          width: '100%',
        }}
      >
        {status === SOCKET_CONNECTING ? (
          <>
            <CircularProgress 
              size={48}
              sx={{
                color: theme => theme.palette.primary.main
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                textAlign: 'center'
              }}
            >
              Establishing Connection...
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: 'center'
              }}
            >
              Please wait while we connect to the server
            </Typography>
          </>
        ) : (
          <>
            <WifiOff 
              size={48}
              style={{
                color: '#7855fb',
                opacity: 0.9
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                textAlign: 'center'
              }}
            >
              Connection Error
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textAlign: 'center'
              }}
            >
              Unable to connect to server. Attempting to reconnect in the background.
              You can still view previous generations.
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
}

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

  // Lists of available LLMs
  const [models, setModels] = useState(null);

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
      setIsLoading(false);

      socket.off("metadata");
      socket.off("tokens");
      socket.off("complete");
      setProtState(PROTOCOL_STATE_IDLE);
      
      console.error("socket connection error...");
    });

    socket.on('connect', () => {
      // Refresh the models list
      socket.on('get_models_return', (data) => {
        setModels((prev) => { return data; });
        socket.off('get_models');
        // Unblock webpage
        setConnection(SOCKET_CONNECTED);
        console.log("socket connected!");
      });
      socket.emit('get_models');
    });

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBrowserNavigation);
      socket.disconnect();
    };
  }, [editing]);

  // State management of the protocol to the backend
  const [protState, setProtState] = useState(PROTOCOL_STATE_IDLE);
  const [metadata, setMetadata] = useState(null);
  const [scriptText, setScriptText] = useState(null);

  const metadataRef = useRef(metadata);
  useEffect(() => {
    metadataRef.current = metadata;
  }, [metadata]);
  const scriptTextRef = useRef(scriptText);
  useEffect(() => {
    scriptTextRef.current = scriptText;
  }, [scriptText]);

  const initiateProtocol = (url, fileObj, modelIdx) => {
    // This function initiate the event driven protocol via
    // websocket to communicate with the server and stream back the tokens
    // One of the two first arguments must be null!

    if (protState !== PROTOCOL_STATE_IDLE) {
      alert("Protocol in inconsistent state! Should never see this message!!");
      return;
    }

    setMetadata(null);
    setScriptText(null);

    // Make sure all the event listeners are in a clean state.
    socket.off("metadata");
    socket.off("tokens");
    socket.off("complete");
    socket.off("error");

    // Prime the event listeners before we initiate the protocol.
    socket.on("metadata", (data) => {
      setProtState((prev) => { return PROTOCOL_STATE_METADATA_RECV });
      setMetadata((prev) => {
        let resp_metadata = data;
        if (fileObj === null) {
          resp_metadata.url = url;
        } else {
          resp_metadata.url = null;
        }
        return resp_metadata;
      });
      setScriptText((prev) => { return "" });
      setProtState((prev) => { return PROTOCOL_STATE_WAITING_FIRST_TOKEN });
    });

    // Next step after metadata receive: listen for tokens
    socket.on("tokens", (data) => {
      setProtState((prev) => {
        if (prev === PROTOCOL_STATE_WAITING_FIRST_TOKEN) {
          // Received first token, time to navigate!
          return PROTOCOL_STATE_WAITING_TOKENS;
        } else {
          return prev;
        }
      })
      setScriptText((prev) => { return prev + data["tokens"]; });
    });

    // Final step when we get the completion event
    socket.on("complete", () => {
      // Clean up the event listeners
      socket.off("metadata");
      socket.off("tokens");
      socket.off("complete");
      socket.off("error")
      setProtState((prev) => { return PROTOCOL_STATE_IDLE; });

      addKBtoLocalStorage(metadataRef.current, scriptTextRef.current);
      refreshSavedKbs();

      setIsLoading((prev) => { return false; });
    });

    socket.on("error", (data) => {
      alert(data.error);

      socket.off("metadata");
      socket.off("tokens");
      socket.off("complete");
      socket.off("error")
      setProtState((prev) => { return PROTOCOL_STATE_IDLE; });
      setIsLoading((prev) => { return false; });
    })

    // Start the protocol sequence.
    setProtState((prev) => { return PROTOCOL_STATE_WAITING_FOR_METADATA; });
    if (fileObj === null) {
      const payload = { url: url, modelIdx: modelIdx };
      socket.emit("url_generate", payload);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        // Get base64 encoded string of the file
        const fileData = reader.result.split(",")[1];
        const payload = { filename: fileObj.name, data: fileData, modelIdx: modelIdx };
        socket.emit("file_generate", payload);
      };
      reader.readAsDataURL(fileObj);
    }
  };


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
            setMetadata={setMetadata}
            setScriptText={setScriptText}
          />

          {brainRot ? <VideoBackground /> : <NutanixBirds />}

          {/* Page content */}
          <Routes className="url-input-container">
            <Route path="/" element={
              connection === SOCKET_CONNECTED ? (
                <MainPage
                  models={models}
                  brainRot={brainRot}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  refreshSavedKbs={refreshSavedKbs}
                  initiateProtocol={initiateProtocol}
                  protState={protState}
                />
              ) : (
                <ConnectionStatus status={connection} />
              )
            }/>
            <Route path="/result" element={
              <ScriptBox
                brainRot={brainRot}
                refreshSavedKbs={refreshSavedKbs}
                editing={editing}
                setEditing={setEditing}
                protState={protState}
                metadata={metadata}
                scriptText={scriptText}
                setScriptText={setScriptText}
                setIsLoading={setIsLoading}
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