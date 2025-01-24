import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ntxLogo from '../assets/nutanix.svg';
import { useNavigate, useLocation } from 'react-router';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';
import { Divider, ListItem } from '@mui/material';
import { getKBfromLocalStorage } from '../utils/localStorage';
import { Modal } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Navbar = () => {
  const navigate = useNavigate();

  const [openAbout, setOpenAbout] = React.useState(false);
  const [savedKbs, setSavedKbs] = React.useState(getKBfromLocalStorage());

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  // Close the sidebar on navigation event, and refresh the saved KBs
  const location = useLocation();
  React.useEffect(() => {
    setOpenDrawer(false);
    setSavedKbs(getKBfromLocalStorage());
  }, [location.pathname]);

  return (
    <AppBar position='static' color='primary' 
      sx={{
        boxShadow: '0 10px 8px rgba(0, 0, 0, 0.5)',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          {/* Sidebar components */}
          <IconButton onClick={toggleDrawer(true)}>
            <DensityMediumIcon />
          </IconButton>
          <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
            <Button
              sx={{
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              onClick={() => {setOpenAbout(true)}}
            >
              About
            </Button>
            <Modal
              open={openAbout}
              onClose={() => {setOpenAbout(false)}}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
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
                    ["Adib Akbari", ""],
                    ["Bill Nguyen", "https://www.linkedin.com/in/bill-nguyen-737061232"],
                    ["Biswas Simkhada", ""],
                    ["Joseph Hayek", ""],
                    ["Leo Li", ""],
                    ["Lucas Young", ""],
                    ["Sandin Jayasekera", ""],
                    ["Elizabeth Pynadath", ""]
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
            </Modal>

            <Button
              sx={{
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              // onClick={() => {placeholder}}
            >
              Instruction
            </Button>

            <Divider />

            <Button
              sx={{
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              onClick={() => {
                if (window.confirm('Clearing all previous script generations, are you sure?') === true) {
                  localStorage.clear();
                  setSavedKbs(getKBfromLocalStorage());
                }
              }}
            >
              Clear All
            </Button>

            <Divider />

            <Box 
              sx={{
                width: 300,
              }}
              role='presentation'
            >
              <List>
                {savedKbs.map((pastKb) => {
                  return (
                    <Button
                      sx={{
                        textAlign: 'start'
                      }}
                      onClick={() => {
                        navigate('/result', { state: { scriptText: pastKb.data}})
                      }}
                    >
                      {pastKb.kbId + ' - ' + pastKb.timeGenerated + ' - ' + pastKb.title}
                    </Button>
                  )
                })}
              </List>
            </Box>
          </Drawer>

          {/* Chiron framework button */}
          <Button
            color='primary'
            variant='text'
            component='div'
            sx={{
                fontSize: '1.4rem',
                fontWeight: 'bold',
                textShadow: `0 0 25px rgba(255, 255, 255, 0.35)`,    
            }}
            onClick={() => {navigate('/');}}
          >
            Chiron Framework
          </Button>
        </Box>

        {/* NTNX logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src={ntxLogo} alt='Nutanix Logo' style={{ height: 20, width: 'auto' }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;