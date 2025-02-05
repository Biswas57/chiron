import React from 'react';
import Box from '@mui/material/Box';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Divider, ListItem, Typography } from '@mui/material';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';

function AboutModal() {
  return (
    <Box
      sx={{
        background: 'rgba(4, 4, 4, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        padding: 4,
        borderRadius: 2,
        width: '400px',
        color: 'text.primary',
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontWeight: 600
        }}
      >
        About Chiron
      </Typography>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'text.secondary',
          mb: 3,
          lineHeight: 1.6
        }}
      >
        This application was developed by a passionate team of SRE interns at Sydney, Australia on January 2025.
      </Typography>

      <Divider sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        my: 2 
      }} />

      <List>
        {[
          ["Adib Akbari", "https://www.linkedin.com/in/adibakbari"],
          ["Bill Nguyen", "https://www.linkedin.com/in/bill-nguyen-737061232"],
          ["Biswas Simkhada", "https://www.linkedin.com/in/biswas-simkhada"],
          ["Joseph Hayek", "https://au.linkedin.com/in/joseph-hayek-000385318"],
          ["Leo Li", "https://www.linkedin.com/in/leo-l-384b4b160"],
          ["Lucas Young", "https://www.linkedin.com/in/lyou02"],
          ["Sandin Jayasekera", "https://www.linkedin.com/in/sandin-j"],
          ["Elizabeth Pynadath", "https://www.linkedin.com/in/elizebethpynadath"]
        ].map((author, index) => (
          <ListItem
            key={index}
            sx={{
              py: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }
            }}
            secondaryAction={
              author[1] && (
                <IconButton
                  edge="end"
                  onClick={() => window.open(author[1], "_blank")}
                  sx={{
                    color: '#0077b5',
                    '&:hover': {
                      color: '#00a0dc',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
              )
            }
          >
            <Typography sx={{ color: 'text.secondary' }}>
              {author[0]}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default AboutModal;