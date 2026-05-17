import React, { useState } from 'react';
import SkillInput from '../components/SkillInput';
import { addCandidate } from '../utils/api';

export default function AddCandidate({ onNavigate }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    experience: '',
    bio: '',
  });
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim()) return setError('Name is required.');
    if (!form.email.trim()) return setError('Email is required.');
    if (skills.length === 0) return setError('Add at least one skill.');
    if (form.experience === '' || isNaN(Number(form.experience)))
      return setError('Valid experience (years) is required.');

    setLoading(true);
    try {
      await addCandidate({
        ...form,
        experience: Number(form.experience),
        skills,
      });
      setSuccess(`✓ ${form.name} has been added successfully!`);
      setForm({ name: '', email: '', experience: '', bio: '' });
      setSkills([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Add Candidate</h1>
        <p className="page-subtitle">Register a new candidate in the talent pool</p>
      </div>

      <div style={{ maxWidth: '600px' }}>
        <div className="card">
          <div className="card-title">👤 Candidate Details</div>

          {error && <div className="alert alert-error">⚠ {error}</div>}
          {success && (
            <div className="alert alert-success">
              {success}
              <button
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '14px' }}
                onClick={() => onNavigate('candidates')}
              >
                View All →
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  className="form-input"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Experience (years) *</label>
              <input
                className="form-input"
                name="experience"
                type="number"
                min="0"
                step="0.5"
                value={form.experience}
                onChange={handleChange}
                placeholder="e.g. 2"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Skills *</label>
              <SkillInput
                skills={skills}
                onChange={setSkills}
                placeholder="Type a skill and press Enter (e.g. React)"
              />
              <div className="form-hint">Press Enter or comma to add a skill</div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio / Projects</label>
              <textarea
                className="form-textarea"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Brief description of projects or background..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                {loading ? <span className="spinner" /> : '＋'}
                {loading ? 'Adding…' : 'Add Candidate'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setForm({ name: '', email: '', experience: '', bio: '' });
                  setSkills([]);
                  setError('');
                  setSuccess('');
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Sample data hint */}
        <div className="card" style={{ marginTop: '16px' }}>
          <div className="card-title" style={{ fontSize: '13px' }}>💡 Sample Candidates to Try</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '2' }}>
            <div>• <strong>Rahul Sharma</strong> — React, Node.js, MongoDB — 2 yrs</div>
            <div>• <strong>Priya Patel</strong> — React, Node.js, AWS — 3 yrs</div>
            <div>• <strong>Ankit Gupta</strong> — HTML, CSS, JavaScript — 1 yr</div>
            <div>• <strong>Neha Singh</strong> — Python, Django, PostgreSQL — 4 yrs</div>
          </div>
        </div>
      </div>
    </div>
  );
}
