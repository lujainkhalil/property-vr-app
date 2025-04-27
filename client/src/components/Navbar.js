import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';

function Navbar() {
  const location = useLocation();

  return (
    <AppBar 
      position="static" 
      sx={{
        background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        py: 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ minHeight: '72px' }}>
          <Typography 
            variant="h5" 
            component={RouterLink} 
            to="/"
            sx={{ 
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
              fontWeight: 700,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            <ApartmentIcon sx={{ fontSize: 32 }} />
            Property VR App
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 1.5,
            '& .MuiButton-root': {
              borderRadius: '8px',
              px: 2,
              py: 1,
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
              }
            }
          }}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              startIcon={<HomeIcon />}
              sx={{
                backgroundColor: location.pathname === '/' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/listings"
              startIcon={<ApartmentIcon />}
              sx={{
                backgroundColor: location.pathname === '/listings' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
            >
              Listings
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/listings/create"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: location.pathname === '/listings/create' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
            >
              Create Listing
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/chat"
              startIcon={<ChatIcon />}
              sx={{
                backgroundColor: location.pathname === '/chat' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              }}
            >
              Chat Assistant
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 