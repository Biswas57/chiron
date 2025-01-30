import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import '@fontsource/inter';
import { useLocation } from 'react-router';
import { Divider, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { editKBtoLocalStorage, getKBfromLocalStorage } from '../utils/localStorage';
import TextField from '@mui/material/TextField';

function ScriptBox({brainRot, refreshSavedKbs}) {
  // Get the result from App.js
  const location = useLocation();
  const { state } = location;

  const [scriptText, setScriptText] = useState("");
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setScriptText(state.scriptText);
  }, [location.state]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(scriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleEdit = () => {
    if (editing) {
      editKBtoLocalStorage(state.idx, scriptText);
      refreshSavedKbs();
      setEditing(false);
    } else {
      setEditing(true);
    }
  }

  return (
    <Box
      key={location.key}
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
      {/* <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
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
      <Tooltip title={editing ? "Save!" : "Edit Text"}>
        <IconButton
          onClick={handleEdit}
          sx={{
            position: 'absolute',
            top: 16,
            right: 64,
            color: 'grey.400',
            '&:hover': {
              color: 'grey.100'
            }
          }}
        >
          <AnimatePresence mode="wait">
            {editing ? (
              <motion.div
                key="save"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SaveIcon />
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <EditIcon />
              </motion.div>
            )}
          </AnimatePresence>
        </IconButton>
      </Tooltip> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {
          editing ? (
            <TextField
              multiline
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              onKeyDown={(event) => event.stopPropagation()}
              sx={{
                width: '100%',
                marginTop: '30px',
                color: 'grey.100',
                fontSize: '1.125rem',
                lineHeight: 1.7,
                '& p': {
                  marginBottom: 2
                },
                overflowWrap: 'break-word'
              }}
            />
          ) : (
            <Box
            sx={{
              color: 'grey.100',
              fontSize: '1.125rem',
              lineHeight: 1.7,
              '& p': {
                marginBottom: 2
              },
              overflowWrap: 'break-word'
            }}
            >
              {(scriptText.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>    
              )))}
            </Box>
          )
        }

        <Divider />

        <Box
          sx={{
            flexDirection: 'column', 
            justifyContent: 'center',
            display: (editing ? "none" : "flex"),
          }}
        >
          <Typography
            sx={{
              fontSize: '1.125rem',
              textAlign: 'center'
            }}
          >
            Everything looks good?
          </Typography>
          <Button
            onClick={() => {window.open("https://app.synthesia.io/", "_blank")}}
            sx={{
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            Open Synthesia
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default ScriptBox;