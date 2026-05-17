require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const candidateRoutes = require('./routes/candidates');
const matchRoutes = require('./routes/match');
const aiRoutes = require('./routes/ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/candidates', candidateRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Candidate Shortlisting API is running' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/candidate_shortlist';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
