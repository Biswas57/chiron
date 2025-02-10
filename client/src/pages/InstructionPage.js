import React, { useState } from 'react';
import { Box, Typography, Paper, Collapse, IconButton, Link } from '@mui/material';
import { ChevronDown, ChevronRight, ArrowDown } from 'lucide-react';

function InstructionPage() {
  const [expandedStep, setExpandedStep] = useState(null);

  const steps = [
    {
      title: "Select Your Article",
      details: [
        "Paste any KB article link",
        "AI will automatically create a video script",
        "Access your previous articles anytime from the menu"
      ]
    },
    {
      title: "Review Your Script",
      details: [
        "Read through the AI-generated script",
        "Make any needed edits or adjustments",
        "Perfect your message before recording"
      ]
    },
    {
      title: "Create Your Video",
      details: [
        <><Link href="https://app.synthesia.io/" target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main' }}>Open Synthesia</Link></>,
        "Create a new scene for each section",
        "Record with professional AI voiceover",
        "Add your screen recordings"
      ]
    },
    {
      title: "Preview and Polish",
      details: [
        "Watch your completed video",
        "Check for quality and flow",
        "Make any final tweaks"
      ]
    }
  ];

  return (
    <Box sx={{ 
      maxWidth: "800px", 
      margin: "0 auto", 
      padding: 4,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      gap: 4 
    }}>
      <Typography 
        variant="h5" 
        sx={{ 
          textAlign: "center", 
        //   mb: 6,
          color: "white",
          fontWeight: "bold"
        }}
      >
        Instructions:
      </Typography>

      {steps.map((step, index) => (
        <Box key={index} sx={{ position: "relative" }}>
          <Paper
            onClick={() => setExpandedStep(expandedStep === index ? null : index)}
            sx={{
              p: 3,
              background: "background.paper",
              borderRadius: 2,
              border: "1px solid",
              borderColor: expandedStep === index ? "primary.main" : "transparent",
              transition: "all 0.3s ease",
              cursor: "pointer",
              '&:hover': {
                borderColor: "primary.main",
                transform: "translateX(8px)"
              }
            }}
          >
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  color: "text.primary"
                }}
              >
                <Box
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    width: 35,
                    height: 35,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold"
                  }}
                >
                  {index + 1}
                </Box>
                {step.title}
              </Typography>
              <IconButton 
                sx={{ ml: "auto", color: "primary.main" }}
              >
                {expandedStep === index ? <ChevronDown /> : <ChevronRight />}
              </IconButton>
            </Box>

            <Collapse in={expandedStep === index}>
              <Box sx={{ mt: 3, pl: 7 }}>
                {step.details.map((detail, detailIndex) => (
                  <Typography
                    key={detailIndex}
                    sx={{
                      color: "text.secondary",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      '&:before': {
                        content: '""',
                        width: 6,
                        height: 6,
                        bgcolor: "primary.main",
                        borderRadius: "50%",
                        mr: 2,
                        display: "inline-block"
                      }
                    }}
                  >
                    {detail}
                  </Typography>
                ))}
              </Box>
            </Collapse>
          </Paper>

          {index < steps.length - 1 && (
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                bottom: -32,
                transform: "translateX(-50%)",
                color: "primary.main",
                zIndex: 1
              }}
            >
              <ArrowDown size={24} />
            </Box>
          )}
        </Box>
      ))}

      <Typography 
        sx={{ 
          textAlign: "center", 
          mt: 4,
          color: "text.secondary",
          fontStyle: "italic"
        }}
      >
        That's it! Your article is now an engaging video resource.
      </Typography>
    </Box>
  );
}

export default InstructionPage;