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
import ErrorModal from './components/ErrorModal';
import Game from "./pages/Game"
import { addKBtoLocalStorage, getAllKBfromLocalStorage, editKBtoLocalStorage } from './utils/localStorage';
import io from 'socket.io-client';
import { Typography, CircularProgress, Paper } from '@mui/material';
import { WifiOff } from 'lucide-react';
import {
  PROTOCOL_STATE_IDLE,
  PROTOCOL_STATE_WAITING_FOR_METADATA,
  PROTOCOL_STATE_METADATA_RECV,
  PROTOCOL_STATE_WAITING_FIRST_TOKEN,
  PROTOCOL_STATE_WAITING_TOKENS,
  PROTOCOL_STATE_QUEUEING
} from './utils/protocol'

const API_URL = '/';

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

  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  // This needs to be a global state to disable the navbar during AI generation
  // Navigating during generation leads to a bunch of weirdness.
  const [isLoading, setIsLoading] = useState(false);
  const [queuePos, setQueuePos] = useState(-1);

  const [brainRot, setBrainRot] = useState(false);
  const [theme, setTheme] = useState(themes.default);
  useEffect(() => {
    setTheme(brainRot ? themes.brainrot : themes.default);
  }, [brainRot]);

  // Server connection status.
  const [connection, setConnection] = useState(SOCKET_CONNECTING);

  // Lists of available LLMs
  const [models, setModels] = useState(null);

  // State management of the protocol to the backend
  const [protState, setProtState] = useState(PROTOCOL_STATE_IDLE);
  const [metadata, setMetadata] = useState(null);
  const [scriptText, setScriptText] = useState(null);

  // Global state to disable navigation during edit mode
  const [editing, setEditing] = useState(false);

  // Reference to allow event listeners to always see the latest state consistently
  const metadataRef = useRef(metadata);
  useEffect(() => {
    metadataRef.current = metadata;
  }, [metadata]);
  const scriptTextRef = useRef(scriptText);
  useEffect(() => {
    scriptTextRef.current = scriptText;
  }, [scriptText]);
  const editingRef = useRef(editing);
  useEffect(() => {
    editingRef.current = editing;
  }, [editing]);
  const protStateRef = useRef(protState);
  useEffect(() => {
    protStateRef.current = protState;
  }, [protState]);

  const [savedKbs, setSavedKbs] = useState(getAllKBfromLocalStorage());
  const [selectedKB, setSelectedKB] = useState(null);
  const [selectedKBIndex, setSelectedKBIndex] = useState(null);
  // Reference to allow event listeners to always see the latest state consistently
  // Workaround of a crash that happens on autosave at navigate.
  const selectedKBIndexRef = useRef(selectedKBIndex);
  useEffect(() => {
    selectedKBIndexRef.current = selectedKBIndex;
  }, [selectedKBIndex]);

  const viewSavedKB = (idx, history = savedKbs) => {
    history[idx].resetCurrentIndex();
    setSelectedKB(history[idx]);
    setSelectedKBIndex(idx);
    setScriptText(history[idx].getCurrentData().data);
  };

  const nextHistItm = () => {
    selectedKB.goToNextData();
    setScriptText(selectedKB.getCurrentData().data);
  }

  const prevHistItm = () => {
    selectedKB.goToPreviousData();
    setScriptText(selectedKB.getCurrentData().data);
  }

  const editKB = () => {
    editKBtoLocalStorage(selectedKBIndexRef.current, scriptTextRef.current);
    const newKbs = getAllKBfromLocalStorage();
    setSavedKbs(newKbs);
    viewSavedKB(selectedKBIndexRef.current, newKbs);
  }

  const clearHistory = () => {
    localStorage.removeItem("KBs");
    setSavedKbs([]);
    setSelectedKB(null);
  }

  useEffect(() => {
    // Open a socket to the server on mount
    socket = io(API_URL, {
      transports: ['websocket'],
    });

    const handleSocketDisconnect = () => {
      setConnection(SOCKET_ERROR);
      setIsLoading(false);

      socket.off("metadata");
      socket.off("tokens");
      socket.off("complete");
      socket.off("error");
      socket.off("queue");
      setProtState(PROTOCOL_STATE_IDLE);
    }

    socket.on('connect_error', () => {
      handleSocketDisconnect();
      console.error("socket connection error...");
    });

    socket.on('disconnect', () => {
      handleSocketDisconnect();
      console.error("socket disconnected...");
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

    // Put the website back into a consistent state if the user click back or forward during edit or generating script
    window.addEventListener("popstate", () => {
      if (editingRef.current) {
        setErrorMessage("You have clicked the back/forward browser button during edit mode. Your work have been automatically saved.");
        setErrorModalOpen(true);
        editKB();
        setEditing(false);
      }
      if (protState != PROTOCOL_STATE_IDLE) {
        // Disconnect will trigger a clean up of protocol states by the disconnect event listener
        socket.disconnect();
        socket.connect();
      }
    });

    // Cleanup event listener on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

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
    setQueuePos(-1);

    // Make sure all the event listeners are in a clean state.
    socket.off("metadata");
    socket.off("tokens");
    socket.off("complete");
    socket.off("error");
    socket.off("queue");

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
      socket.off("error");
      socket.off("queue");
      setProtState((prev) => { return PROTOCOL_STATE_IDLE; });

      addKBtoLocalStorage(metadataRef.current, scriptTextRef.current);

      const newKbs = getAllKBfromLocalStorage();
      setSavedKbs(newKbs);
      // Use the fresh history to update the selected script:
      viewSavedKB(0, newKbs);

      setIsLoading((prev) => { return false; });
    });

    socket.on("error", (data) => {
      setErrorMessage(data.error);
      setErrorModalOpen(true);

      socket.off("metadata");
      socket.off("tokens");
      socket.off("complete");
      socket.off("error");
      socket.off("queue");
      setProtState((prev) => { return PROTOCOL_STATE_IDLE; });
      setIsLoading((prev) => { return false; });
    })

    // Now this part starts the protocol sequence, we find a place in the queue
    socket.on("queue", (data) => {
      if (data.queue_pos > 0) {
        setProtState((prev) => { return PROTOCOL_STATE_QUEUEING; });
        setQueuePos(data.queue_pos);
      } else {
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
      }
    });

    socket.emit("enqueue", {});
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <>
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
              editing={editing}
              setMetadata={setMetadata}
              selectSavedKB={viewSavedKB}
              clearHistory={clearHistory}
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
                    initiateProtocol={initiateProtocol}
                    protState={protState}
                    queuePos={queuePos}
                  />
                ) : (
                  <ConnectionStatus status={connection} />
                )
              }/>
              <Route path="/result" element={
                <ScriptBox
                  brainRot={brainRot}
                  editing={editing}
                  setEditing={setEditing}
                  protState={protState}
                  metadata={metadata}
                  scriptText={scriptText}
                  setScriptText={setScriptText}
                  setIsLoading={setIsLoading}
                  nextHistItm={nextHistItm}
                  prevHistItm={prevHistItm}
                  nextHistAvail={selectedKB && selectedKB.currentIndex < selectedKB.data.length - 1}
                  prevHistAvail={selectedKB && selectedKB.currentIndex > 0}
                  editKB={editKB}
                />
              }/>
              <Route path="/game" element={<Game />} />
              <Route path="/instructions" element={<InstructionPage/>} />
            </Routes>
          </Box>
          <ErrorModal
            open={errorModalOpen}
            onClose={() => setErrorModalOpen(false)}
            message={errorMessage}
          />
        </>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;