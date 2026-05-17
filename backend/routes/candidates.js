const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// POST /api/candidates - Add a new candidate
router.post('/', async (req, res) => {
  try {
    const { name, email, skills, experience, bio } = req.body;

    // Normalize skills
    const normalizedSkills = skills.map((s) => s.trim());

    const candidate = new Candidate({
      name,
      email,
      skills: normalizedSkills,
      experience,
      bio: bio || '',
    });

    await candidate.save();
    res.status(201).json({ success: true, data: candidate });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/candidates - Get all candidates
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { skills: { $elemMatch: { $regex: search, $options: 'i' } } },
        ],
      };
    }

    const candidates = await Candidate.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: candidates.length, data: candidates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/candidates/:id - Get single candidate
router.get('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, data: candidate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/candidates/:id - Delete a candidate
router.delete('/:id', async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }
    res.json({ success: true, message: 'Candidate deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
