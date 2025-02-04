import React, { useState, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import { Box, Typography, Paper, Button, Collapse, IconButton, Divider, MenuItem } from '@mui/material';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import ErrorModal from './ErrorModal';
import Select from '@mui/material/Select';

const InputBox = ({ models, onSubmitURL, onSubmitFile }) => {
  const [modelIdx, setModelIdx] = useState(0);
  const handleModelChange = (event) => {
    setModelIdx(event.target.value);
  }

  const [url, setUrl] = useState('');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState(false);
  const [expandedSection, setExpandedSection] = useState('public'); // 'public' or 'internal'
  const urlPattern = /^https:\/\/portal\.nutanix\.com\//;

  const handleSubmitURL = (e) => {
    e.preventDefault();
    if (urlPattern.test(url.trim())) {
      setError(false);
      onSubmitURL(url);
    } else {
      setError(true);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const fname = acceptedFiles[0].name;
    const fname_split = fname.split('.');
    if (fname_split.length > 0) {
      if (fname_split.pop().toLowerCase() === "pdf") {
        setFileObj(acceptedFiles[0]);
        return;
      }
    }
    setErrorMessage("File must be a PDF that ends in '.pdf' or '.PDF'");
    setErrorModalOpen(true);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
  });

  const [fileObj, setFileObj] = useState(null);

  const SectionHeader = ({ title, subtitle, isExpanded, onClick }) => (
    <Box 
      onClick={onClick}
      sx={{ 
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        p: 2,
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography
          variant="h6"
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            fontSize: '1.1rem'
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            backgroundColor: 'rgba(120, 85, 251, 0.2)',
            color: 'text.secondary',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: 500,
            border: '1px solid rgba(120, 85, 251, 0.3)'
          }}
        >
          {subtitle}
        </Typography>
      </Box>
      <IconButton 
        sx={{ ml: 'auto', color: 'primary.main' }}
        onClick={onClick}
      >
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </IconButton>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '540px',
          padding: '24px',
          background: 'rgba(4, 4, 4, 0.1)',
          backdropFilter: 'blur(5px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box>
          <Typography
            sx={{
              paddingLeft: '15px',
              paddingBottom: '15px',
              color: 'text.primary',
              fontWeight: 600,
              fontSize: '1.1rem'
            }}
          >
            Choose your LLM
          </Typography>
          <Select
            value={modelIdx}
            onChange={handleModelChange}
            sx={{
              width: '100%'
            }}
          >
            {models.map((model, index) => {
              return (
                <MenuItem
                  value={index}
                >
                  {models[index].display_name + " - " + models[index].note}
                </MenuItem>
              )
            })}
          </Select>
        </Box>

        <Divider
          sx={{
            marginTop: '20px',
            marginBottom: '10px'
          }}
        />

        {/* Public KB Section */}
        <SectionHeader 
          title="Enter URL"
          subtitle="Only Public KBs"
          isExpanded={expandedSection === 'public'}
          onClick={() => setExpandedSection('public')}
        />
        
        <Collapse in={expandedSection === 'public'}>
          <Box
            component="form"
            onSubmit={handleSubmitURL}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 2,
              mb: 2,
            }}
          >
            <TextField
              label="Enter Public KB Article URL"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              error={error}
              helperText={error ? 'URL must be from the Nutanix portal.' : ''}
              color="primary"
              autoComplete="off"
              inputProps={{
                autoComplete: 'off',
              }}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(120, 85, 251, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#7855fb',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#7855fb',
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                backgroundColor: '#7855fb',
                padding: '10px 30px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                '&:hover': {
                  backgroundColor: '#5b3ecc',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Submit URL
            </Button>
          </Box>
        </Collapse>

        {/* Internal KB Section */}
        <SectionHeader 
          title="Upload PDF"
          subtitle="All KBs"
          isExpanded={expandedSection === 'internal'}
          onClick={() => setExpandedSection('internal')}
        />
        
        <Collapse in={expandedSection === 'internal'}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 2,
            }}
          >
            <Paper
              {...getRootProps()}
              sx={{
                border: '2px dashed rgba(120, 85, 251, 0.5)',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: 3,
                textAlign: 'center',
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  borderColor: '#7855fb',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <input {...getInputProps()} />
              <Typography 
                variant="body1" 
                sx={{
                  color: fileObj === null ? 'text.secondary' : 'text.primary',
                  fontWeight: 500
                }}
              >
                {fileObj === null ? "Drag n' drop KB article PDF" : ("Selected: " + fileObj.name)}
              </Typography>
            </Paper>

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  backgroundColor: '#7855fb',
                  padding: '8px 24px',
                  fontWeight: 600,
                  opacity: fileObj === null ? 0.5 : 1,
                  '&:hover': {
                    backgroundColor: '#5b3ecc',
                    transform: fileObj === null ? 'none' : 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={() => {onSubmitFile(fileObj)}}
                disabled={fileObj === null}
              >
                Upload
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#7855fb',
                  color: '#7855fb',
                  padding: '8px 24px',
                  fontWeight: 600,
                  opacity: fileObj === null ? 0.5 : 1,
                  '&:hover': {
                    borderColor: '#5b3ecc',
                    backgroundColor: 'rgba(120, 85, 251, 0.1)',
                    transform: fileObj === null ? 'none' : 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={() => {setFileObj(null)}}
                disabled={fileObj === null}
              >
                Discard
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Box>
      <ErrorModal 
        open={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorMessage}
      />
    </>
  );
};

export default InputBox;