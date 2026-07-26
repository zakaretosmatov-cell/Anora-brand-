require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

const app = express();

// Connect to MongoDB Database (with local JSON fallback if config is missing or invalid)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/perfumes', require('./routes/perfumeRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));

// Serve a basic welcome message for the API root
app.get('/', (req, res) => {
  res.json({
    message: 'MERN Perfume Showcase API is running...',
    status: 'online',
    version: '1.0.0'
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`  Server is running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  API Root: http://localhost:${PORT}/`);
  console.log(`================================================`);
});
