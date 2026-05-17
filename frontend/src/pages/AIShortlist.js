import React, { useState } from 'react';
import SkillInput from '../components/SkillInput';
import CandidateCard from '../components/CandidateCard';
import { aiShortlist } from '../utils/api';

export default function AIShortlist() {
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [minExperience, setMinExperience] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (requiredSkills.length === 0) return setError('Add at least one required skill.');
    setError('');
    setLoading(true);
    try {
      const res = await aiShortlist({
        requiredSkills,
        preferredSkills,
        minExperience: Number(minExperience) || 0,
      });
      setResults(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'AI matching failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">AI Matching</h1>
        <p className="page-subtitle">
          <span className="badge ai" style={{ marginRight: '8px' }}>🤖 Powered by OpenRouter</span>
          Intelligent candidate ranking with contextual analysis
        </p>
      </div>

      <div className="alert alert-warning" style={{ maxWidth: '740px' }}>
        ⚠ <strong>Requires OpenRouter API key.</strong> Add your key to <code>backend/.env</code> as <code>OPENROUTER_API_KEY</code>.
        Get one free at <a href="https://openrouter.ai" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>openrouter.ai</a>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Form */}
        <div className="card" style={{ position: 'sticky', top: '32px' }}>
          <div className="card-title">
            🤖 AI Job Requirements
            <span className="badge ai" style={{ marginLeft: 'auto', fontSize: '10px' }}>GPT-4o-mini</span>
          </div>
          {error && <div className="alert alert-error">⚠ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Required Skills *</label>
              <SkillInput
                skills={requiredSkills}
                onChange={setRequiredSkills}
                placeholder="e.g. React"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Skills</label>
              <SkillInput
                skills={preferredSkills}
                onChange={setPreferredSkills}
                placeholder="e.g. AWS"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Minimum Experience (years)</label>
              <input
                className="form-input"
                type="number"
                min="0"
                step="0.5"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                placeholder="e.g. 2"
              />
            </div>
            <button className="btn btn-ai btn-full" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : '🤖'}
              {loading ? 'AI is analyzing…' : 'Run AI Analysis'}
            </button>
          </form>

          {loading && (
            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <div style={{ color: 'var(--accent-light)', fontWeight: '500', marginBottom: '6px' }}>🤖 AI is working…</div>
              Analyzing profiles, comparing skills, and generating recommendations. This may take 10–20 seconds.
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          {results === null ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">🤖</div>
                <div className="empty-title">AI-powered candidate matching</div>
                <p style={{ fontSize: '14px', maxWidth: '360px', margin: '8px auto 0' }}>
                  Unlike rule-based matching, AI understands context — it considers transferable skills, career trajectory, and overall fit.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
                {[
                  { icon: '🧠', title: 'Smart Analysis', desc: 'Understands skill relationships and transferability' },
                  { icon: '📝', title: 'Explanations', desc: 'Provides reasoning for each ranking decision' },
                  { icon: '💪', title: 'Strengths & Gaps', desc: 'Identifies what each candidate brings and lacks' },
                  { icon: '❓', title: 'Interview Questions', desc: 'Generates tailored questions per candidate' },
                ].map((f) => (
                  <div key={f.title} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{f.icon}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>{f.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">😕</div>
                <div className="empty-title">No candidates to analyze</div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {results.length} candidates ranked by AI
                </span>
                <span className="badge ai">🤖 AI Ranked</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {results.map((c, i) => (
                  <CandidateCard key={c._id} candidate={c} showScore showAI rank={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
