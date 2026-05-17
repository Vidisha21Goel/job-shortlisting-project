const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const Candidate = require('../models/Candidate');
const { matchCandidates } = require('./match');

// POST /api/ai/shortlist - AI-based candidate ranking
router.post('/shortlist', async (req, res) => {
  try {
    const { requiredSkills, minExperience = 0, preferredSkills = [] } = req.body;

    if (!requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ success: false, message: 'requiredSkills is required' });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return res.status(400).json({
        success: false,
        message:
          'OpenRouter API key not configured. Please add your OPENROUTER_API_KEY to the .env file.',
      });
    }

    // First run basic matching
    const candidates = await Candidate.find();
    const basicMatched = matchCandidates(candidates, {
      requiredSkills,
      minExperience,
      preferredSkills,
    });

    if (basicMatched.length === 0) {
      return res.json({ success: true, total: 0, data: [] });
    }

    // Build AI prompt
    const candidateList = basicMatched
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} | Skills: ${c.skills.join(', ')} | Experience: ${c.experience} years | Bio: ${c.bio || 'N/A'}`
      )
      .join('\n');

    const prompt = `You are an expert technical recruiter. Analyze and rank these candidates for a job role.

Job Requirements:
- Required Skills: ${requiredSkills.join(', ')}
- Minimum Experience: ${minExperience} years
- Preferred Skills: ${preferredSkills.length > 0 ? preferredSkills.join(', ') : 'None'}

Candidates:
${candidateList}

For EACH candidate, provide a JSON array (and nothing else) in this exact format:
[
  {
    "name": "Candidate Name",
    "aiRank": 1,
    "aiScore": 85,
    "recommendation": "Brief 1-2 sentence explanation of why this candidate is suitable or not",
    "strengths": ["strength1", "strength2"],
    "gaps": ["gap1"]
  }
]

Return ONLY the JSON array, no markdown, no extra text.`;

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Candidate Shortlisting System',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      throw new Error(`OpenRouter API error: ${aiResponse.status} - ${errText}`);
    }

    const aiData = await aiResponse.json();
    const aiText = aiData.choices?.[0]?.message?.content || '[]';

    // Parse AI response
    let aiRankings = [];
    try {
      const cleaned = aiText.replace(/```json|```/g, '').trim();
      aiRankings = JSON.parse(cleaned);
    } catch {
      console.error('Failed to parse AI response:', aiText);
      aiRankings = [];
    }

    // Merge AI rankings with basic match data
    const enriched = basicMatched.map((candidate) => {
      const aiData = aiRankings.find(
        (a) => a.name.toLowerCase() === candidate.name.toLowerCase()
      ) || null;

      return {
        ...candidate,
        aiRank: aiData?.aiRank || null,
        aiScore: aiData?.aiScore || null,
        recommendation: aiData?.recommendation || 'AI analysis not available',
        strengths: aiData?.strengths || [],
        gaps: aiData?.gaps || [],
      };
    });

    // Sort by AI rank if available, else by matchScore
    enriched.sort((a, b) => {
      if (a.aiRank && b.aiRank) return a.aiRank - b.aiRank;
      return b.matchScore - a.matchScore;
    });

    res.json({ success: true, total: enriched.length, data: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/ai/interview-questions - Generate interview questions
router.post('/interview-questions', async (req, res) => {
  try {
    const { candidateId, jobRequirements } = req.body;

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      return res.status(400).json({
        success: false,
        message: 'OpenRouter API key not configured.',
      });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    const prompt = `Generate 5 targeted technical interview questions for this candidate.

Candidate: ${candidate.name}
Skills: ${candidate.skills.join(', ')}
Experience: ${candidate.experience} years
Bio: ${candidate.bio || 'N/A'}

Job Requirements: ${jobRequirements || 'General technical role'}

Return ONLY a JSON array of questions in this format:
[
  { "question": "Question text here?", "category": "Technical/Behavioral/Situational", "difficulty": "Easy/Medium/Hard" }
]`;

    const aiResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Candidate Shortlisting System',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    });

    const aiData = await aiResponse.json();
    const aiText = aiData.choices?.[0]?.message?.content || '[]';

    let questions = [];
    try {
      const cleaned = aiText.replace(/```json|```/g, '').trim();
      questions = JSON.parse(cleaned);
    } catch {
      questions = [];
    }

    res.json({ success: true, candidate: candidate.name, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
