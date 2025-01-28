import React from 'react';
import Box from '@mui/material/Box';
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import MainPage from './pages/MainPage';
import ScriptBox from "./pages/ScriptBox";
import theme from './Theme';

function App() {
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
          
          <Navbar />

          {/* Page content */}
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/result" element={<ScriptBox />} />
          </Routes>

        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;