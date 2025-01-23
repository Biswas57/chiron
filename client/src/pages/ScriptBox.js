import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import '@fontsource/inter';
import { useLocation } from 'react-router';

function ScriptBox() {
  // Get the result from App.js
  const location = useLocation();
  const { state } = location;
  const scriptText = state.scriptText;

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '900px',
        mx: 'auto',
        mt: 4,
        p: 4,
        borderRadius: 2,
        bgcolor: 'rgba(33, 33, 33, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: theme => theme.shadows[10],
        position: 'relative'
      }}
    >
      <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
        <IconButton
          onClick={handleCopy}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'grey.400',
            '&:hover': {
              color: 'grey.100'
            }
          }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CheckIcon />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ContentCopyIcon />
              </motion.div>
            )}
          </AnimatePresence>
        </IconButton>
      </Tooltip>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box
          sx={{
            color: 'grey.100',
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.125rem',
            lineHeight: 1.7,
            '& p': {
              marginBottom: 2
            },
            overflowWrap: 'break-word'
          }}
        >
          {scriptText.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </Box>
      </motion.div>
    </Box>
  );
};

export default ScriptBox;