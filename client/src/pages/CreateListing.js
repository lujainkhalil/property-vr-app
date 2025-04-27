import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Fade,
  Divider,
  InputAdornment,
  Stack,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from 'axios';

function CreateListing() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    images: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const showNotification = (message, severity = 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const validateFileType = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    let hasError = false;
    
    // Validate each file
    files.forEach(file => {
      if (!validateFileType(file)) {
        hasError = true;
        showNotification('Invalid file type. Only JPEG, PNG and GIF are allowed.');
        return;
      }
    });

    if (!hasError) {
      setImageFiles(prev => [...prev, ...files]);
      showNotification('Images added successfully!', 'success');
    }

    // Clear the input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleRemoveImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    showNotification('Image removed', 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.description) {
      showNotification('Please fill in all required fields');
      return;
    }

    if (imageFiles.length === 0) {
      showNotification('Please add at least one image');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('description', formData.description);

    imageFiles.forEach((file) => {
      formDataToSend.append('images', file);
    });

    try {
      await axios.post('http://localhost:5013/api/listings', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      showNotification('Listing created successfully!', 'success');
      setTimeout(() => {
        navigate('/listings');
      }, 1500);
    } catch (error) {
      console.error('Error creating listing:', error);
      if (error.response?.data?.message) {
        showNotification(error.response.data.message);
      } else {
        showNotification('Error creating listing. Please try again.');
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: 'grey.50', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 6 },
              background: 'linear-gradient(to right, #ffffff, #f8f9fa)',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #1976d2, #2196f3)'
              }} 
            />

            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                textAlign: 'center',
                mb: 4,
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
              Create New Listing
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <TextField
                    required
                    fullWidth
                    label="Property Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'white'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    label="Price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'white'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Description"
                    name="description"
                    multiline
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Enter a detailed description of your property..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 2 }}>
                          <DescriptionIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'white'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      border: '2px dashed',
                      borderColor: 'primary.main',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'primary.soft',
                      },
                    }}
                    onClick={() => document.getElementById('image-input').click()}
                  >
                    <input
                      type="file"
                      id="image-input"
                      multiple
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                    <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" gutterBottom>
                      Drop images here or click to upload
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supported formats: JPEG, PNG, GIF
                    </Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {imageFiles.map((file, index) => (
                      <Grid item key={index} xs={12} sm={6} md={4}>
                        <Fade in={true} timeout={500}>
                          <Card 
                            sx={{ 
                              position: 'relative',
                              borderRadius: 2,
                              overflow: 'hidden',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                              '&:hover': {
                                boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                              }
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="200"
                              image={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              sx={{
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                  transform: 'scale(1.05)'
                                }
                              }}
                            />
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveImage(index)}
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'white',
                                '&:hover': {
                                  backgroundColor: 'white',
                                  transform: 'scale(1.1)',
                                }
                              }}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Card>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/listings')}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={imageFiles.length === 0}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                        boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)'
                        }
                      }}
                    >
                      Create Listing
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Fade>
      </Container>

      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CreateListing; 