import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import InputBox from './components/URLInput';
import LoadingAnimation from './components/LoadingAnimation';
import theme from './Theme';
import VideoBackground from './components/VideoBackground';
import ScriptBox from "./components/ScriptBox";

const MotionBox = motion(Box);

function App() {
  const [showScript, setShowScript] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptText, setScriptText] = useState("");

  const handleUrlSubmit = async (url) => {
    setIsLoading(true);
    
    try {
      // Replace this with actual API call
      await new Promise(resolve => setTimeout(resolve, 7000));
      
      // example text from api call
      setScriptText(`Lorem ipsum dolor sit amet. Ut laboriosam quisquam ea explicabo enim sed quia aspernatur hic corporis odio 33 quaerat sint et veritatis atque in rerum architecto. Sit provident perferendis non perspiciatis reprehenderit ea magni sint sit aliquid recusandae est asperiores harum quo quae odio. Hic laboriosam soluta et modi ratione aut mollitia nihil et voluptatum consectetur! Eum laboriosam unde ex molestiae voluptas a exercitationem autem?

        Hic sunt officiis eum praesentium odio et officiis quae et sapiente eligendi. Qui repudiandae debitis qui veritatis modi qui molestiae dolores ad porro delectus et quam beatae et corrupti praesentium id quia quod. Ex nemo temporibus est doloribus officia id possimus cumque hic mollitia adipisci aut cumque velit aut repellat magnam in incidunt iure?
        
        At eaque dolor et molestiae consectetur ut similique doloribus est rerum similique et tempora perspiciatis. Sed impedit consequatur et veniam perferendis aut exercitationem tempora. Eos veritatis veniam et accusamus alias non sunt necessitatibus non alias minima et voluptatem maxime et quaerat tempore et molestias dicta.
        
        Et explicabo blanditiis ut assumenda voluptas et natus nemo et vitae Quis! Non repellendus voluptas qui neque aperiam et neque dolor. Quo atque iusto est suscipit pariatur est similique voluptate eos alias laborum ut quae vitae.
        
        Et nihil nisi aut galisum quisquam in esse explicabo. Et dolor perferendis nam aliquid rerum aut placeat vitae vel odit natus eum dignissimos porro et numquam dignissimos id omnis fugit.
        
        `);
      setShowScript(true);
    } catch (error) {
      console.error('Error fetching script:', error);
      // handle error
    } finally {
      setIsLoading(false);
    }
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
        <AnimatePresence mode="wait">
          {!showScript && !isLoading && (
            <MotionBox
              key="input"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InputBox onSubmit={handleUrlSubmit} />
            </MotionBox>
          )}
          {isLoading && (
            <MotionBox
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingAnimation />
            </MotionBox>
          )}
          {showScript && !isLoading && (
            <MotionBox
              key="script"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ScriptBox scriptText={scriptText} />
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </ThemeProvider>
  );
}

export default App;