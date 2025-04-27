import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  Button,
  InputAdornment,
  Paper,
  Chip,
  Fade,
  useTheme,
  IconButton,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Alert,
  Stack,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import axios from 'axios';

function Listings() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [propertyType, setPropertyType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
  }, [sortBy, propertyType]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5013/api/listings');
      let sortedListings = [...response.data];
      
      // Apply sorting
      switch (sortBy) {
        case 'price-asc':
          sortedListings.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-desc':
          sortedListings.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'newest':
          sortedListings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }

      setListings(sortedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Failed to fetch listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchTerm) params.append('title', searchTerm);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (propertyType !== 'all') params.append('type', propertyType);

      const response = await axios.get(
        `http://localhost:5013/api/listings/search?${params.toString()}`
      );
      setListings(response.data);
    } catch (error) {
      console.error('Error searching listings:', error);
      setError('Failed to search listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid item xs={12} sm={6} md={4} key={item} sx={{ height: '400px' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent sx={{ flex: 1, p: 2 }}>
              <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
              <Box sx={{ mt: 'auto' }}>
                <Skeleton variant="rectangular" height={32} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ 
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      pb: 8 
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          color: 'white',
          pt: { xs: 6, md: 10 },
          pb: { xs: 12, md: 16 },
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to bottom right, transparent 49%, #f8fafc 50%)',
          }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                component="h1"
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  color: 'white'
                }}
              >
                Find Your Dream Home
              </Typography>
              <Typography 
                variant="h5"
                sx={{ 
                  mb: 4,
                  opacity: 0.9,
                  fontWeight: 400,
                  color: 'white'
                }}
              >
                Explore our curated selection of premium properties
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/listings/create"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                List Your Property
              </Button>
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={6} 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Box
                component="img"
                src="http://localhost:5013/uploads/Modern Home.jpg"
                alt="Modern home"
                sx={{
                  width: '100%',
                  height: '300px',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  transform: 'perspective(1000px) rotateY(-10deg)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'perspective(1000px) rotateY(0deg)',
                  }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: { xs: -6, md: -8 },
          position: 'relative',
          zIndex: 1,
          px: { xs: 2, sm: 3, md: 4, lg: 6 }
        }}
      >
        {/* Search and Filter Section */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3,
            mb: 6,
            borderRadius: 3,
            background: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            maxWidth: 1600,
            mx: 'auto'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'grey.50'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                placeholder="Min Price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'grey.50'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                placeholder="Max Price"
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'grey.50'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <Select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  displayEmpty
                  sx={{
                    borderRadius: 2,
                    bgcolor: 'grey.50'
                  }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="house">House</MenuItem>
                  <MenuItem value="apartment">Apartment</MenuItem>
                  <MenuItem value="condo">Condo</MenuItem>
                  <MenuItem value="villa">Villa</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                startIcon={<FilterListIcon />}
                sx={{
                  height: '56px',
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Section */}
        <Box 
          sx={{ 
            mb: 4,
            maxWidth: 1600,
            mx: 'auto'
          }}
        >
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center" 
            sx={{ mb: 3 }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {loading ? (
                <Skeleton width={200} />
              ) : (
                `${listings.length} Properties Available`
              )}
            </Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                }
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Grid 
              container 
              spacing={3}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)'
                },
                gap: 3
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <Grid 
                  item 
                  key={item} 
                  sx={{ height: '400px' }}
                >
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent sx={{ flex: 1, p: 2 }}>
                      <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                      <Box sx={{ mt: 'auto' }}>
                        <Skeleton variant="rectangular" height={32} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : listings.length === 0 ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 3,
                bgcolor: 'grey.50'
              }}
            >
              <HomeWorkIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Properties Found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search criteria or check back later for new listings.
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setSearchTerm('');
                  setMinPrice('');
                  setMaxPrice('');
                  setPropertyType('all');
                  fetchListings();
                }}
              >
                Clear Filters
              </Button>
            </Paper>
          ) : (
            <Grid 
              container 
              spacing={3}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)'
                },
                gap: 3
              }}
            >
              {listings.map((listing, index) => (
                <Grid 
                  item 
                  key={listing._id} 
                  sx={{
                    height: '400px'
                  }}
                >
                  <Fade in={true} timeout={500 + index * 100}>
                    <Card
                      component={RouterLink}
                      to={`/listings/${listing._id}`}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          position: 'relative',
                          height: '200px',
                          width: '100%',
                          flexShrink: 0,
                          backgroundColor: 'grey.100'
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={listing.images?.[0] ? `http://localhost:5013${listing.images[0]}` : '/placeholder.jpg'}
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
                            ${listing.price ? listing.price.toLocaleString() : 'N/A'}
                          </Typography>
                        </Box>
                      </Box>

                      <CardContent 
                        sx={{ 
                          flex: 1,
                          p: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden'
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
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Listings; 