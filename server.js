require('dotenv').config();  // To load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const Listing = require('./models/listing');  // Import the Listing model

// Initialize express app
const app = express();


// Middlewares
app.use(cors());
app.use(express.json());  // To parse incoming JSON data
app.use((err, req, res, next) => {
  console.error('🔥 Global error:', err);
  res.status(500).json({ error: err.message || 'Unexpected error' });
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
});

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });

// Routes
// Root endpoint to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is up and running 🚀');
});

// Create a new property listing
app.post('/api/listings', upload.array('images', 5), async (req, res) => {
  const { title, price, description } = req.body;

  if (!title || !price || !description) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const imagePaths = req.files.map(file => `/uploads/${file.filename}`);

  try {
    const newListing = new Listing({
      title,
      price,
      description,
      images: imagePaths
    });

    await newListing.save();

    res.status(201).json({
      message: 'Listing with images created successfully!',
      listing: newListing,
    });
  } catch (error) {
    console.error('❌ Error creating listing:', error);
    res.status(500).json({ error: 'An error occurred while creating the listing.' });
  }
});


// Get all property listings
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    console.error('❌ Error fetching listings:', error);
    res.status(500).json({ error: 'An error occurred while fetching listings.' });
  }
});


// search for specific listing
app.get('/api/listings/search', async (req, res) => {
  try {
    const { title, minPrice, maxPrice, description } = req.query;

    let query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' };  // Case-insensitive search
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (description) {
      query.description = { $regex: description, $options: 'i' };
    }

    console.log('Search Query:', query);  // Log the built query object

    const listings = await Listing.find(query);

    if (listings.length === 0) {
      return res.status(404).json({ message: 'No listings found matching your criteria.' });
    }

    res.json(listings);
  } catch (error) {
    console.error('❌ Error during search query execution:', error);  // Log the error in detail
    res.status(500).json({ error: 'An error occurred while searching for listings.', details: error.message });
  }
});

// Get a specific property listing by ID
app.get('/api/listings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.status(200).json(listing);
  } catch (error) {
    console.error('❌ Error fetching listing by ID:', error);
    res.status(500).json({ error: 'An error occurred while fetching the listing.' });
  }
});

// Update a property listing by ID
app.put('/api/listings/:id', async (req, res) => {
  const { id } = req.params;
  const { title, price, description } = req.body;

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { title, price, description },
      { new: true }  // Return the updated listing
    );

    if (!updatedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json({
      message: 'Property listing updated successfully!',
      listing: updatedListing,
    });
  } catch (error) {
    console.error('❌ Error updating listing:', error);
    res.status(500).json({ error: 'An error occurred while updating the listing.' });
  }
});

// Delete a property listing by ID
app.delete('/api/listings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json({
      message: 'Property listing deleted successfully!',
      listing: deletedListing,
    });
  } catch (error) {
    console.error('❌ Error deleting listing:', error);
    res.status(500).json({ error: 'An error occurred while deleting the listing.' });
  }
});


// Starting the server on a given port (default is 5002)
const PORT = process.env.PORT || 5013;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
