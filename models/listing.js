// models/listing.js

const mongoose = require('mongoose');

// Define the schema for a property listing
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: [String],
}, { timestamps: true });

// Create a model based on the schema
const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
