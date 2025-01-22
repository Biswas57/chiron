import React from 'react';
import { Box } from '@mui/material';
import video from "../assets/Pattern-Charcoal.mp4"

const VideoBackground = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // Ensures that the video is behind all content
        overflow: 'hidden',
      }}
    >
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          objectFit: 'cover', // Ensures the video covers the entire screen without distortion
        }}
      >
        <source src={video} type="video/mp4" />
      </video>
    </Box>
  );
};

export default VideoBackground;
