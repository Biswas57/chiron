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
import { addKBtoLocalStorage, getAllKBfromLocalStorage, editKBtoLocalStorage } from './utils/localStorage';
import io from 'socket.io-client';
import { Typography } from '@mui/material';
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

  const [savedKbs, setSavedKbs] = useState(getAllKBfromLocalStorage());
  const [selectedKB, setSelectedKB] = useState(null);
  const [selectedKBIndex, setSelectedKBIndex] = useState(null);

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

  // Global state to disable navigation during edit mode
  const [editing, setEditing] = useState(false);
  const editKB = () => {
    editKBtoLocalStorage(selectedKBIndex, scriptText);
    const newKbs = getAllKBfromLocalStorage();
    setSavedKbs(newKbs);
    viewSavedKB(selectedKBIndex, newKbs);
  }

  const clearHistory = () => {
    localStorage.removeItem("KBs");
    setSavedKbs([]);
    setSelectedKB(null);
  }

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

      const newKbs = getAllKBfromLocalStorage();
      setSavedKbs(newKbs);
      // Use the fresh history to update the selected script:
      viewSavedKB(0, newKbs);

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
                />
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
                      Cannot connect to server, reattempting connection in background. In the meantime you can only view previous generations.
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
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;