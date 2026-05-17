import React, { useEffect, useState } from 'react';
import { getCandidates } from '../utils/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '13px',
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>{label}</div>
        <div style={{ color: 'var(--accent-light)', fontWeight: 600 }}>
          {payload[0].value} candidate{payload[0].value !== 1 ? 's' : ''}
        </div>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ onNavigate }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCandidates()
      .then((res) => setCandidates(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Compute stats
  const skillMap = {};
  candidates.forEach((c) => {
    c.skills.forEach((s) => {
      const key = s.toLowerCase();
      skillMap[key] = (skillMap[key] || 0) + 1;
    });
  });

  const topSkills = Object.entries(skillMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([skill, count]) => ({ skill: skill.charAt(0).toUpperCase() + skill.slice(1), count }));

  const expGroups = { '0-1 yrs': 0, '2-3 yrs': 0, '4-6 yrs': 0, '7+ yrs': 0 };
  candidates.forEach((c) => {
    if (c.experience <= 1) expGroups['0-1 yrs']++;
    else if (c.experience <= 3) expGroups['2-3 yrs']++;
    else if (c.experience <= 6) expGroups['4-6 yrs']++;
    else expGroups['7+ yrs']++;
  });

  const expData = Object.entries(expGroups).map(([label, count]) => ({ label, count }));

  const avgExp =
    candidates.length > 0
      ? (candidates.reduce((s, c) => s + c.experience, 0) / candidates.length).toFixed(1)
      : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your talent pool</p>
      </div>

      {/* Stats */}
      <div className="grid-3 section-gap" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon purple">👥</div>
          <div>
            <div className="stat-value">{loading ? '…' : candidates.length}</div>
            <div className="stat-label">Total Candidates</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🛠</div>
          <div>
            <div className="stat-value">{loading ? '…' : Object.keys(skillMap).length}</div>
            <div className="stat-label">Unique Skills</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⭐</div>
          <div>
            <div className="stat-value">{loading ? '…' : avgExp}</div>
            <div className="stat-label">Avg Experience</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">🎯</div>
          <div>
            <div className="stat-value">
              {loading ? '…' : topSkills[0]?.skill || '—'}
            </div>
            <div className="stat-label">Top Skill</div>
          </div>
        </div>
      </div>

      {candidates.length === 0 && !loading ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">🏁</div>
            <div className="empty-title">No candidates yet</div>
            <p style={{ fontSize: '14px', marginBottom: '20px' }}>
              Add your first candidate to start building your talent pool.
            </p>
            <button className="btn btn-primary" onClick={() => onNavigate('add-candidate')}>
              + Add Candidate
            </button>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {/* Top Skills Chart */}
          <div className="card">
            <div className="card-title">📊 Top Skills in Pool</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topSkills} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="skill"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Experience Distribution */}
          <div className="card">
            <div className="card-title">📈 Experience Distribution</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={expData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip valueLabel="Candidates" nameKey="label" />} />
                <Bar dataKey="count" fill="var(--green)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ marginTop: '24px' }}>
        <div className="card">
          <div className="card-title">⚡ Quick Actions</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('add-candidate')}>
              👤 Add Candidate
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('shortlist')}>
              🎯 Run Shortlist
            </button>
            <button className="btn btn-ai" onClick={() => onNavigate('ai-shortlist')}>
              🤖 AI Matching
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('candidates')}>
              📋 View All Candidates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
