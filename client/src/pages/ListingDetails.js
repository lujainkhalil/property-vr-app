import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Card,
  CardMedia,
  Chip,
  IconButton,
  Divider,
  Stack,
  Fade,
  useTheme,
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeIcon from '@mui/icons-material/Home';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

function ListingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [listing, setListing] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchListing = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5013/api/listings/${id}`);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5013/api/listings/${id}`);
      navigate('/listings');
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={40} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={100} sx={{ mb: 3 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Listing not found.</Typography>
      </Container>
    );
  }

  return (
    <Fade in={true}>
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', pb: 8 }}>
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/listings')}
            sx={{ mb: 3 }}
          >
            Back to Listings
          </Button>

          <Grid container spacing={4}>
            {/* Main Image */}
            <Grid item xs={12}>
              <Box sx={{ position: 'relative' }}>
                <Card 
                  sx={{ 
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    '&:hover': {
                      '& .MuiBox-root': {
                        opacity: 1
                      }
                    }
                  }}
                  onClick={() => {
                    setSelectedImageIndex(0);
                    setImageDialogOpen(true);
                  }}
                >
                  <CardMedia
                    component="img"
                    height="500"
                    image={`http://localhost:5013${listing.images?.[selectedImageIndex]}`}
                    alt={listing.title}
                    sx={{
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.3)',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography variant="h6" color="white">
                      Click to view all images
                    </Typography>
                  </Box>
                </Card>

                {/* Image Navigation */}
                {listing.images?.length > 1 && (
                  <>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'white' }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'white' }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </Grid>

            {/* Thumbnail Images */}
            {listing.images?.length > 1 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    overflowX: 'auto',
                    pb: 2,
                    '::-webkit-scrollbar': {
                      height: 6,
                      bgcolor: 'grey.100',
                      borderRadius: 3,
                    },
                    '::-webkit-scrollbar-thumb': {
                      bgcolor: 'primary.main',
                      borderRadius: 3,
                    },
                  }}
                >
                  {listing.images.map((image, index) => (
                    <Card
                      key={index}
                      sx={{
                        width: 100,
                        height: 100,
                        flexShrink: 0,
                        cursor: 'pointer',
                        border: index === selectedImageIndex ? 2 : 0,
                        borderColor: 'primary.main',
                        borderRadius: 2,
                        overflow: 'hidden',
                        opacity: index === selectedImageIndex ? 1 : 0.7,
                        transition: 'all 0.2s',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <CardMedia
                        component="img"
                        height="100"
                        image={`http://localhost:5013${image}`}
                        alt={`${listing.title} - Image ${index + 1}`}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  ))}
                </Box>
              </Grid>
            )}

            {/* Content */}
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4,
                  borderRadius: 3,
                  bgcolor: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                      {listing.title}
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
                      ${listing.price.toLocaleString()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => navigate(`/listings/${id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Box>

                <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: 'wrap', gap: 2 }}>
                  <Chip
                    icon={<LocationOnIcon />}
                    label={listing.location || "New York"}
                    sx={{
                      bgcolor: 'primary.soft',
                      color: 'primary.main',
                      '& .MuiChip-icon': { color: 'primary.main' }
                    }}
                  />
                  <Chip
                    icon={<BedIcon />}
                    label={`${listing.beds || 3} Beds`}
                    sx={{
                      bgcolor: 'primary.soft',
                      color: 'primary.main',
                      '& .MuiChip-icon': { color: 'primary.main' }
                    }}
                  />
                  <Chip
                    icon={<BathtubIcon />}
                    label={`${listing.baths || 2} Baths`}
                    sx={{
                      bgcolor: 'primary.soft',
                      color: 'primary.main',
                      '& .MuiChip-icon': { color: 'primary.main' }
                    }}
                  />
                  <Chip
                    icon={<SquareFootIcon />}
                    label="2,500 sq ft"
                    sx={{
                      bgcolor: 'primary.soft',
                      color: 'primary.main',
                      '& .MuiChip-icon': { color: 'primary.main' }
                    }}
                  />
                  <Chip
                    icon={<HomeIcon />}
                    label={listing.type || "House"}
                    sx={{
                      bgcolor: 'primary.soft',
                      color: 'primary.main',
                      '& .MuiChip-icon': { color: 'primary.main' }
                    }}
                  />
                  <Chip
                    icon={<CalendarTodayIcon />}
                    label={new Date(listing.createdAt).toLocaleDateString()}
                    sx={{
                      bgcolor: 'primary.soft',
                      color: 'primary.main',
                      '& .MuiChip-icon': { color: 'primary.main' }
                    }}
                  />
                </Stack>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Description
                </Typography>
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ 
                    color: 'text.secondary',
                    whiteSpace: 'pre-line',
                    mb: 4
                  }}
                >
                  {listing.description}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Features
                </Typography>
                <Grid container spacing={2}>
                  {['Central AC', 'Parking', 'Garden', 'Security System', 'Fireplace', 'High Ceilings'].map((feature) => (
                    <Grid item xs={12} sm={6} md={4} key={feature}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main'
                          }}
                        />
                        <Typography>{feature}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>

          {/* Image Gallery Dialog */}
          <Dialog
            open={imageDialogOpen}
            onClose={() => setImageDialogOpen(false)}
            maxWidth="lg"
            fullWidth
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  Image Gallery
                </Typography>
                <IconButton onClick={() => setImageDialogOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={`http://localhost:5013${listing.images?.[selectedImageIndex]}`}
                  alt={`${listing.title} - Image ${selectedImageIndex + 1}`}
                  sx={{
                    height: 'calc(100vh - 200px)',
                    objectFit: 'contain'
                  }}
                />
                {listing.images?.length > 1 && (
                  <>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'white' }
                      }}
                      onClick={handlePrevImage}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'white',
                        '&:hover': { bgcolor: 'white' }
                      }}
                      onClick={handleNextImage}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this listing? This action cannot be undone.
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Box>
            </DialogContent>
          </Dialog>
        </Container>
      </Box>
    </Fade>
  );
}

export default ListingDetails; 