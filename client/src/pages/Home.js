import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  CardMedia,
  Paper,
  useTheme,
  useMediaQuery,
  Stack,
  Chip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddHomeIcon from '@mui/icons-material/AddHome';
import ChatIcon from '@mui/icons-material/Chat';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import axios from 'axios';

function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [featuredListings, setFeaturedListings] = useState([]);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const response = await axios.get('http://localhost:5013/api/listings');
      // Get the 3 most recent listings
      const recentListings = response.data.slice(-3).reverse();
      setFeaturedListings(recentListings);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    }
  };

  return (
    <Box>
      {/* Hero Section with Background Image */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url('/hero-bg.jpg')`,
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(25,118,210,0.2) 0%, rgba(25,118,210,0.1) 100%)',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              position: 'relative',
              p: { xs: 2, md: 4 },
              pr: { md: 0 },
              zIndex: 2,
              animation: 'fadeIn 1s ease-in',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            <Typography
              component="h1"
              variant={isMobile ? 'h3' : 'h2'}
              color="inherit"
              gutterBottom
              sx={{
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.5px',
                mb: 2,
                '&::after': {
                  content: '""',
                  display: 'block',
                  width: '60px',
                  height: '4px',
                  backgroundColor: 'primary.main',
                  marginTop: '16px',
                  borderRadius: '2px'
                }
              }}
            >
              Find Your Dream Home
            </Typography>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              color="inherit"
              paragraph
              sx={{
                mb: 4,
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                maxWidth: '600px',
                lineHeight: 1.5
              }}
            >
              Discover the perfect property with our immersive virtual reality experience
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                mt: 4,
                '& .MuiButton-root': {
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }
                }
              }}
            >
              <Button
                variant="contained"
                component={RouterLink}
                to="/listings"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                }}
              >
                Browse Listings
              </Button>
              <Button
                variant="outlined"
                component={RouterLink}
                to="/listings/create"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  color: 'white',
                  borderColor: 'white',
                  borderRadius: '8px',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                List Your Property
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Featured Listings Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          sx={{ 
            mb: 6,
            fontWeight: 600,
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '60px',
              height: '4px',
              backgroundColor: 'primary.main',
              margin: '16px auto',
              borderRadius: '2px'
            }
          }}
        >
          Featured Properties
        </Typography>
        <Grid 
          container 
          spacing={4}
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)'
            },
            gap: 4
          }}
        >
          {featuredListings.slice(0, 3).map((listing) => (
            <Grid 
              item 
              key={listing._id}
              sx={{
                height: '450px'
              }}
            >
              <Card
                component={RouterLink}
                to={`/listings/${listing._id}`}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  borderRadius: 3,
                  overflow: 'hidden',
                  bgcolor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <Box sx={{ position: 'relative', height: '220px', flexShrink: 0 }}>
                  <CardMedia
                    component="img"
                    image={`http://localhost:5013${listing.images?.[0]}`}
                    alt={listing.title}
                    sx={{
                      height: '100%',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      color: 'white',
                      p: 2,
                      pt: 3
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      ${listing.price?.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <CardContent 
                  sx={{ 
                    flex: 1,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{
                        fontWeight: 600,
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.2
                      }}
                    >
                      {listing.title}
                    </Typography>
                    <Typography 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5,
                        fontSize: '0.875rem',
                        mb: 1
                      }}
                    >
                      {listing.description}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 'auto' }}>
                    <Stack 
                      direction="row" 
                      spacing={1}
                      sx={{ 
                        flexWrap: 'wrap',
                        gap: 1
                      }}
                    >
                      <Chip
                        icon={<LocationOnIcon />}
                        label={listing.location || "New York"}
                        size="small"
                        sx={{
                          bgcolor: 'primary.soft',
                          color: 'primary.main',
                          '& .MuiChip-icon': { color: 'primary.main' }
                        }}
                      />
                      <Chip
                        icon={<BedIcon />}
                        label={`${listing.beds || 3} Beds`}
                        size="small"
                        sx={{
                          bgcolor: 'primary.soft',
                          color: 'primary.main',
                          '& .MuiChip-icon': { color: 'primary.main' }
                        }}
                      />
                      <Chip
                        icon={<BathtubIcon />}
                        label={`${listing.baths || 2} Baths`}
                        size="small"
                        sx={{
                          bgcolor: 'primary.soft',
                          color: 'primary.main',
                          '& .MuiChip-icon': { color: 'primary.main' }
                        }}
                      />
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/cta-bg.jpg')`,
            p: 6,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Find Your Dream Home?
          </Typography>
          <Typography variant="h6" paragraph sx={{ mb: 4 }}>
            Start browsing our listings or create your own property listing today.
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/listings"
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default Home; 