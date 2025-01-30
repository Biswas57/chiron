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
import { CircularProgress, Divider, ListItem } from '@mui/material';
import { Modal } from '@mui/material';
import AboutModal from './AboutModal';

const Navbar = ({brainRot, setBrainRot, isLoading, savedKbs, refreshSavedKbs}) => {
  const navigate = useNavigate();

  const [openAbout, setOpenAbout] = React.useState(false);
  // const [savedKbs, setSavedKbs] = React.useState(getKBfromLocalStorage());

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  // Close the sidebar on navigation event, and refresh the saved KBs
  const location = useLocation();
  React.useEffect(() => {
    setOpenDrawer(false);
    refreshSavedKbs();
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
          <IconButton
            onClick={toggleDrawer(true)}
            onKeyDown={(e) => {e.preventDefault()}}
            disabled={isLoading ? true : false}
          >
            {isLoading ? (<CircularProgress />) : (<DensityMediumIcon />)}
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
              <AboutModal />
            </Modal>

            <Button
              sx={{
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              onClick={() => {navigate('/instructions')}}
            >
              Instruction
            </Button>

            <Button
              sx={{
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              onClick={() => {setBrainRot(!brainRot);}}
            >
              Funky mode: {brainRot ? "Enabled" : "Disabled"}
            </Button>

            <Button
              sx={{
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              onClick={() => {navigate("/game")}}
            >
              Dino
            </Button>

            <Button
              sx={{
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              onClick={() => {
                if (window.confirm('Clearing all previous script generations and return to home page, are you sure?') === true) {
                  localStorage.clear();
                  refreshSavedKbs();
                  navigate('/');
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
                {savedKbs.map((pastKb, idx) => {
                  return (
                    <ListItem
                      key={idx}
                    >
                      <Button
                        sx={{
                          textAlign: 'start',
                          overflowWrap: 'anywhere'
                        }}
                        onClick={() => {
                          navigate('/result', { state: { idx: idx, scriptText: pastKb.data }});
                        }}
                      >
                        {pastKb.kbId + ' - ' + pastKb.timeGenerated + ' - ' + pastKb.title}
                      </Button>
                    </ListItem>
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
            }}
            onClick={() => {
              if (!isLoading) {
                navigate('/');
              }
            }}
          >
            Chiron
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