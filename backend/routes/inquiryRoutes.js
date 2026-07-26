const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { getUseFallback } = require('../config/db');

// --- MongoDB Inquiry Model ---
const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  perfumeId: { type: String },
  perfumeName: { type: String },
  status: { type: String, default: 'Pending' }
}, {
  timestamps: true
});

let MongooseInquiry;
try {
  MongooseInquiry = mongoose.model('Inquiry');
} catch (e) {
  MongooseInquiry = mongoose.model('Inquiry', inquirySchema);
}

// --- JSON Fallback ---
const dataDir = path.join(__dirname, '../data');
const inquiriesFilePath = path.join(dataDir, 'inquiries.json');

const ensureInquiriesFileExists = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(inquiriesFilePath)) {
    fs.writeFileSync(inquiriesFilePath, JSON.stringify([], null, 2), 'utf-8');
  }
};

const saveInquiryJson = (inquiry) => {
  ensureInquiriesFileExists();
  try {
    const data = fs.readFileSync(inquiriesFilePath, 'utf-8');
    const inquiries = JSON.parse(data);
    const newInquiry = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...inquiry,
      status: 'Pending'
    };
    inquiries.push(newInquiry);
    fs.writeFileSync(inquiriesFilePath, JSON.stringify(inquiries, null, 2), 'utf-8');
    return newInquiry;
  } catch (error) {
    console.error('Error writing inquiries JSON:', error);
    return null;
  }
};

const getInquiriesJson = () => {
  ensureInquiriesFileExists();
  try {
    const data = fs.readFileSync(inquiriesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading inquiries JSON:', error);
    return [];
  }
};

// @desc    Submit a client inquiry
// @route   POST /api/inquiries
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, perfumeId, perfumeName } = req.body;
    
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Please fill in all required contact fields' });
    }

    const inquiryData = { name, email, phone, message, perfumeId, perfumeName };

    let savedInquiry;
    if (getUseFallback()) {
      savedInquiry = saveInquiryJson(inquiryData);
    } else {
      const newInquiry = new MongooseInquiry(inquiryData);
      savedInquiry = await newInquiry.save();
    }

    console.log(`[INQUIRY RECEIVER] New inquiry from ${name} regarding ${perfumeName || 'General Inquiry'}`);

    res.status(201).json({
      success: true,
      message: 'Sizning xabaringiz yuborildi. Tez orada siz bilan bog`lanamiz!',
      data: savedInquiry
    });
  } catch (error) {
    res.status(500).json({ message: 'Xabar yuborishda server xatoligi yuz berdi', error: error.message });
  }
});

// @desc    Get all inquiries (For admin review)
// @route   GET /api/inquiries
// @access  Private (Admin)
router.get('/', async (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const clientAuth = req.headers['x-admin-password'];
  
  if (!clientAuth || clientAuth !== adminPassword) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    if (getUseFallback()) {
      const inquiries = getInquiriesJson();
      res.json(inquiries);
    } else {
      const inquiries = await MongooseInquiry.find({}).sort({ createdAt: -1 });
      res.json(inquiries);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving inquiries', error: error.message });
  }
});

module.exports = router;
