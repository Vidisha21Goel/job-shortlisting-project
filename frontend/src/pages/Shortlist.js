import React, { useState } from 'react';
import SkillInput from '../components/SkillInput';
import CandidateCard from '../components/CandidateCard';
import { matchCandidates } from '../utils/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Shortlist() {
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
      const res = await matchCandidates({
        requiredSkills,
        preferredSkills,
        minExperience: Number(minExperience) || 0,
      });
      setResults(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Matching failed.');
    } finally {
      setLoading(false);
    }
  };

  const highCount = results?.filter((c) => c.matchLevel === 'High').length || 0;
  const medCount = results?.filter((c) => c.matchLevel === 'Medium').length || 0;
  const lowCount = results?.filter((c) => c.matchLevel === 'Low').length || 0;

  const chartData = results?.slice(0, 8).map((c) => ({
    name: c.name.split(' ')[0],
    score: c.matchScore,
  })) || [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Shortlist Candidates</h1>
        <p className="page-subtitle">Rule-based skill and experience matching</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Form */}
        <div className="card" style={{ position: 'sticky', top: '32px' }}>
          <div className="card-title">🎯 Job Requirements</div>
          {error && <div className="alert alert-error">{error}</div>}
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
              <div className="form-hint">Preferred skills give a score bonus</div>
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
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : '🎯'}
              {loading ? 'Matching…' : 'Find Matches'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div>
          {results === null ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <div className="empty-title">Set job requirements to find matches</div>
                <p style={{ fontSize: '14px' }}>Enter required skills and experience on the left to shortlist candidates.</p>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="card">
              <div className="empty-state">
                <div className="empty-icon">😕</div>
                <div className="empty-title">No matches found</div>
                <p style={{ fontSize: '14px' }}>Try adjusting the required skills or experience threshold.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid-3 section-gap">
                <div className="stat-card">
                  <div className="stat-icon green">✅</div>
                  <div>
                    <div className="stat-value">{highCount}</div>
                    <div className="stat-label">High Match</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon yellow">⚡</div>
                  <div>
                    <div className="stat-value">{medCount}</div>
                    <div className="stat-label">Medium Match</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon red">○</div>
                  <div>
                    <div className="stat-value">{lowCount}</div>
                    <div className="stat-label">Low Match</div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="card section-gap">
                  <div className="card-title">📊 Match Scores</div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(v) => [`${v}%`, 'Match']}
                        contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px' }}
                      />
                      <Bar dataKey="score" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Candidate list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {results.map((c, i) => (
                  <CandidateCard key={c._id} candidate={c} showScore rank={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
