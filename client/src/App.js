import React, { useState, useEffect, useRef, use } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// import Box from '@mui/material/Box';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import InputBox from './components/URLInput';
import LoadingAnimation from './components/LoadingAnimation';
import theme from './Theme';
import VideoBackground from './components/VideoBackground';
import ScriptBox from "./components/ScriptBox";

import NutanixBirds from "./nutanixBirds"

function App() {
  const [showScript, setShowScript] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptText, setScriptText] = useState("");
  
  

  return(
    <div>
    <NutanixBirds />
    </div>
  )
}

export default App;