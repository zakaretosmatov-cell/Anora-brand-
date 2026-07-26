const express = require('express');
const router = express.Router();
const { PerfumeService } = require('../models/perfumeModel');

// @desc    Get all perfumes
// @route   GET /api/perfumes
// @access  Public
router.get('/', async (req, res) => {
  try {
    const perfumes = await PerfumeService.getAll();
    res.json(perfumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving perfumes catalog', error: error.message });
  }
});

// @desc    Get a single perfume by ID
// @route   GET /api/perfumes/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const perfume = await PerfumeService.getById(req.params.id);
    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found' });
    }
    res.json(perfume);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving perfume details', error: error.message });
  }
});

// Helper middle-ware for simple admin passcode authentication
const adminAuth = (req, res, next) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const clientAuth = req.headers['x-admin-password'];
  
  if (clientAuth && clientAuth === adminPassword) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized. Invalid admin password.' });
  }
};

// @desc    Create a new perfume
// @route   POST /api/perfumes
// @access  Private (Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, brand, description, price, size, notes, family, image, longevity, sillage, gender } = req.body;
    
    if (!name || !brand || !description || !price || !size || !family || !image || !gender) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newPerfume = await PerfumeService.create({
      name,
      brand,
      description,
      price,
      size,
      notes: notes || { top: [], middle: [], base: [] },
      family,
      image,
      longevity: Number(longevity) || 3,
      sillage: Number(sillage) || 3,
      gender
    });

    res.status(201).json(newPerfume);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating perfume entry', error: error.message });
  }
});

// @desc    Update a perfume
// @route   PUT /api/perfumes/:id
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const updatedPerfume = await PerfumeService.update(req.params.id, req.body);
    if (!updatedPerfume) {
      return res.status(404).json({ message: 'Perfume not found or could not be updated' });
    }
    res.json(updatedPerfume);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating perfume entry', error: error.message });
  }
});

// @desc    Delete a perfume
// @route   DELETE /api/perfumes/:id
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const success = await PerfumeService.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Perfume not found or could not be deleted' });
    }
    res.json({ message: 'Perfume deleted successfully from catalog' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting perfume entry', error: error.message });
  }
});

module.exports = router;
