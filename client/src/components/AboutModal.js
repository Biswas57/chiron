import React from 'react';
import Box from '@mui/material/Box';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Divider, ListItem } from '@mui/material';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';

function AboutModal() {
  return (
    <Box
      sx={{
        backgroundColor: 'gray',
        boxShadow: 24,
        padding: 4,
        borderRadius: 2,
        width: '400px',
      }}
    >
      <Box>
        This application was developed by a passionate team of SRE interns at Sydney, Australia on Janurary 2025.
      </Box>
      <Divider />
      <List>
        {[
          ["Adib Akbari", "https://www.linkedin.com/in/adibakbari"],
          ["Bill Nguyen", "https://www.linkedin.com/in/bill-nguyen-737061232"],
          ["Biswas Simkhada", "https://www.linkedin.com/in/biswas-simkhada"],
          ["Joseph Hayek", ""],
          ["Leo Li", "https://www.linkedin.com/in/leo-l-384b4b160"],
          ["Lucas Young", "https://www.linkedin.com/in/lyou02"],
          ["Sandin Jayasekera", "https://www.linkedin.com/in/sandin-j"],
          ["Elizabeth Pynadath", "https://www.linkedin.com/in/elizebethpynadath"]
        ].map((author) => {
          return (
            <ListItem
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={() => {
                    window.open(author[1], "_blank");
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
              }                      
            >
              {author[0]}
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}

export default AboutModal;
