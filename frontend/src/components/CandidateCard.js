import React, { useState } from 'react';
import { deleteCandidate, aiInterviewQuestions } from '../utils/api';

export default function CandidateCard({
  candidate,
  showScore = false,
  showAI = false,
  onDelete,
  rank,
}) {
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);

  const level = candidate.matchLevel?.toLowerCase() || 'low';

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${candidate.name}?`)) return;
    try {
      await deleteCandidate(candidate._id);
      onDelete && onDelete(candidate._id);
    } catch (err) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleInterviewQ = async () => {
    if (showQuestions) {
      setShowQuestions(false);
      return;
    }
    setLoadingQ(true);
    try {
      const res = await aiInterviewQuestions({ candidateId: candidate._id });
      setQuestions(res.data.questions || []);
      setShowQuestions(true);
    } catch (err) {
      alert('Failed to generate questions: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingQ(false);
    }
  };

  return (
    <div className={`candidate-card ${showScore ? level : ''}`}>
      <div className="candidate-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {rank !== undefined && (
            <div className={`rank-badge ${rank < 3 ? 'top3' : ''}`}>#{rank + 1}</div>
          )}
          <div>
            <div className="candidate-name">{candidate.name}</div>
            <div className="candidate-email">{candidate.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="candidate-exp">
            {candidate.experience} yr{candidate.experience !== 1 ? 's' : ''}
          </span>
          {showScore && (
            <span className={`badge ${level}`}>
              {level === 'high' ? '●' : level === 'medium' ? '◐' : '○'} {level}
            </span>
          )}
        </div>
      </div>

      {/* Score bar */}
      {showScore && candidate.matchScore !== undefined && (
        <div className="score-bar-wrapper" style={{ marginBottom: '12px' }}>
          <div className="score-bar">
            <div
              className={`score-bar-fill ${level}`}
              style={{ width: `${candidate.matchScore}%` }}
            />
          </div>
          <span className={`score-text ${level}`}>{candidate.matchScore}%</span>
        </div>
      )}

      {/* Skills */}
      <div className="candidate-skills">
        {candidate.skills.map((skill, i) => {
          const isMatched =
            candidate.requiredSkillsMatched?.map((s) => s.toLowerCase()).includes(skill.toLowerCase());
          const isPreferred =
            candidate.preferredSkillsMatched?.map((s) => s.toLowerCase()).includes(skill.toLowerCase());
          return (
            <span
              key={i}
              className={`tag ${isMatched ? 'tag-green' : isPreferred ? 'tag-accent' : 'tag-default'}`}
            >
              {isMatched && '✓ '}
              {skill}
            </span>
          );
        })}
      </div>

      {/* Experience match indicator */}
      {showScore && (
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
          {candidate.meetsExperience ? (
            <span style={{ color: 'var(--green)' }}>✓ Meets experience requirement</span>
          ) : (
            <span style={{ color: 'var(--red)' }}>✗ Below minimum experience</span>
          )}
          {candidate.requiredSkillsMatched?.length > 0 && (
            <span style={{ marginLeft: '12px' }}>
              {candidate.requiredSkillsMatched.length} required skill
              {candidate.requiredSkillsMatched.length !== 1 ? 's' : ''} matched
            </span>
          )}
        </div>
      )}

      {/* Bio */}
      {candidate.bio && (
        <div className="candidate-bio">{candidate.bio}</div>
      )}

      {/* AI Recommendation */}
      {showAI && candidate.recommendation && (
        <div className="ai-reco-box">
          <div className="ai-reco-label">
            <span>🤖</span>
            AI Analysis
            {candidate.aiScore !== null && (
              <span className="badge ai" style={{ marginLeft: 'auto' }}>
                AI Score: {candidate.aiScore}
              </span>
            )}
          </div>
          <div className="ai-reco-text">{candidate.recommendation}</div>
          {candidate.strengths?.length > 0 && (
            <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {candidate.strengths.map((s, i) => (
                <span key={i} className="tag tag-green" style={{ fontSize: '11px' }}>
                  + {s}
                </span>
              ))}
              {candidate.gaps?.map((g, i) => (
                <span key={i} className="tag tag-red" style={{ fontSize: '11px' }}>
                  − {g}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interview questions */}
      {showQuestions && questions.length > 0 && (
        <div style={{ marginTop: '14px' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--accent-light)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Interview Questions
          </div>
          {questions.map((q, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '6px',
              }}
            >
              <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {i + 1}. {q.question}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span className="tag tag-accent" style={{ fontSize: '11px' }}>{q.category}</span>
                <span
                  className={`tag ${q.difficulty === 'Hard' ? 'tag-red' : q.difficulty === 'Medium' ? 'tag-yellow' : 'tag-green'}`}
                  style={{ fontSize: '11px' }}
                >
                  {q.difficulty}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
        {showAI && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleInterviewQ}
            disabled={loadingQ}
          >
            {loadingQ ? (
              <span className="spinner" style={{ width: '12px', height: '12px' }} />
            ) : (
              '🧠'
            )}
            {showQuestions ? 'Hide Questions' : 'Interview Questions'}
          </button>
        )}
        {onDelete && (
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            🗑 Remove
          </button>
        )}
      </div>
    </div>
  );
}
