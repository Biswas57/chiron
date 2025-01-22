import React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import '@fontsource/inter';

const ScriptBox = ({ scriptText }) => {
  const containerVariants = {
    hidden: { 
      opacity: 0,
      height: 0
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.5,
        ease: "easeOut",
        when: "beforeChildren"
      }
    }
  };

  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: 0.3
      }
    }
  };

  const MotionBox = motion(Box);

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      sx={{
        width: '100%',
        maxWidth: '900px',
        mx: 'auto',
        mt: 4,
        p: 4,
        borderRadius: 2,
        bgcolor: 'rgba(33, 33, 33, 0.95)',
        backdropFilter: 'blur(8px)',
        boxShadow: theme => theme.shadows[10]
      }}
    >
      <MotionBox
        variants={textVariants}
        sx={{
          color: 'grey.100',
          fontFamily: 'Inter, sans-serif',
          fontSize: '1.125rem',
          lineHeight: 1.7,
          '& p': {
            marginBottom: 2
          }
        }}
      >
        {scriptText.split('\n').map((paragraph, index) => (
          <p key={index}>
            {paragraph}
          </p>
        ))}
      </MotionBox>
    </MotionBox>
  );
};

export default ScriptBox;