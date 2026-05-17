const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// Core matching logic
function matchCandidates(candidates, job) {
  const { requiredSkills, minExperience, preferredSkills = [] } = job;

  return candidates
    .map((candidate) => {
      const requiredMatched = candidate.skills.filter((skill) =>
        requiredSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
      );

      const preferredMatched = candidate.skills.filter((skill) =>
        preferredSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
      );

      const requiredScore =
        requiredSkills.length > 0 ? requiredMatched.length / requiredSkills.length : 0;

      const preferredBonus =
        preferredSkills.length > 0 ? (preferredMatched.length / preferredSkills.length) * 0.2 : 0;

      const experienceBonus = candidate.experience >= minExperience ? 0.1 : 0;

      const totalScore = Math.min(requiredScore + preferredBonus + experienceBonus, 1);

      let matchLevel = 'Low';
      if (totalScore >= 0.75) matchLevel = 'High';
      else if (totalScore >= 0.4) matchLevel = 'Medium';

      return {
        ...candidate.toObject(),
        matchScore: Math.round(totalScore * 100),
        requiredSkillsMatched: requiredMatched,
        preferredSkillsMatched: preferredMatched,
        matchLevel,
        meetsExperience: candidate.experience >= minExperience,
      };
    })
    .filter((c) => c.matchScore > 0 || c.meetsExperience)
    .sort((a, b) => b.matchScore - a.matchScore);
}

// POST /api/match - Basic shortlisting
router.post('/', async (req, res) => {
  try {
    const { requiredSkills, minExperience = 0, preferredSkills = [] } = req.body;

    if (!requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ success: false, message: 'requiredSkills is required' });
    }

    const candidates = await Candidate.find();
    const matched = matchCandidates(candidates, { requiredSkills, minExperience, preferredSkills });

    res.json({
      success: true,
      total: matched.length,
      data: matched,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
module.exports.matchCandidates = matchCandidates;
