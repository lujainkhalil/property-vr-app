const express = require('express');
const router = express.Router();
const { getProperties, createProperty } = require('../controllers/propertyController');

// GET /api/properties
router.get('/', getProperties);

// POST /api/properties
router.post('/', createProperty);

module.exports = router;
