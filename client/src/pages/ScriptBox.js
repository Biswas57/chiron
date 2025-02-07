import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import '@fontsource/inter';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { Divider, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import LaunchIcon from '@mui/icons-material/Launch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  PROTOCOL_STATE_IDLE,
  PROTOCOL_STATE_WAITING_TOKENS,
} from '../utils/protocol'

function ScriptBox({ brainRot, editing, setEditing, protState, metadata, scriptText, setScriptText, setIsLoading, nextHistItm, prevHistItm, nextHistAvail, prevHistAvail, editKB,  }) {
  // Get the result from App.js
  const location = useLocation();

  // Get the result from App.js
  const { state } = location;

  const [copied, setCopied] = useState(false);

  const endDivRef = useRef(null);

  useEffect(() => {
    if (protState === PROTOCOL_STATE_IDLE) {
      setIsLoading(false);
    } if (protState === PROTOCOL_STATE_WAITING_TOKENS) {
      // endDivRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  }, [location.state, protState, scriptText]);

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
      editKB()
      // refreshSavedKbs();
      setEditing(false);
    } else {
      setEditing(true);
    }
  }

  // Prevent the result page from rendering if it is navigated to from a dubious state.
  if (metadata === null) {
    return (
      <Navigate to="/" />
    );
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
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
          }}
        >

          <Tooltip title={
            "Previous script edit"
          }>
            <IconButton
              disabled={!prevHistAvail || protState === PROTOCOL_STATE_WAITING_TOKENS}
              onClick={() => {
                prevHistItm();
              }}
              sx={{
                color: 'grey.400',
                '&:hover': {
                  color: 'grey.100'
                }
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title={
            "Next script edit"
          }>
            <IconButton
              disabled={!nextHistAvail || protState === PROTOCOL_STATE_WAITING_TOKENS}
              onClick={() => {
                nextHistItm();
              }}
              sx={{
                color: 'grey.400',
                '&:hover': {
                  color: 'grey.100'
                }
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div
          style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>

          <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
            <IconButton
              onClick={handleCopy}
              disabled={protState === PROTOCOL_STATE_WAITING_TOKENS}
              sx={{
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
              disabled={protState === PROTOCOL_STATE_WAITING_TOKENS}
              sx={{
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
          </Tooltip>
          <Tooltip title={
            metadata.url !== null ? "Go to original KB article" : "Going to article source disabled as this script was generated from a PDF."
          }>
            <IconButton
              disabled={protState === PROTOCOL_STATE_WAITING_TOKENS}
              onClick={() => {
                if (metadata.url !== null) {
                  window.open(metadata.url, '_blank');
                }
              }}
              sx={{
                color: 'grey.400',
                '&:hover': {
                  color: 'grey.100'
                }
              }}
            >
              <LaunchIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
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
              {(scriptText?.split('\n').map((paragraph, index) => (
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
            display: ((editing || protState === PROTOCOL_STATE_WAITING_TOKENS) ? "none" : "flex"),
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
            onClick={() => { window.open("https://app.synthesia.io/", "_blank") }}
            sx={{
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            Open Synthesia
          </Button>
        </Box>

        <div ref={endDivRef} />
      </motion.div>
    </Box>
  );
};

export default ScriptBox;