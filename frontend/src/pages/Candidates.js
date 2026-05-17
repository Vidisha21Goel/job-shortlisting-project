import React, { useEffect, useState, useCallback } from 'react';
import CandidateCard from '../components/CandidateCard';
import { getCandidates } from '../utils/api';

export default function Candidates({ onNavigate }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchCandidates = useCallback(async (q = '') => {
    setLoading(true);
    try {
      const res = await getCandidates(q);
      setCandidates(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
  }, [fetchCandidates]);

  // Debounce search
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
      fetchCandidates(searchInput);
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchInput, fetchCandidates]);

  const handleDelete = (id) => {
    setCandidates((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Candidates</h1>
          <p className="page-subtitle">{candidates.length} candidate{candidates.length !== 1 ? 's' : ''} in pool</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('add-candidate')}>
          ＋ Add Candidate
        </button>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: '24px', maxWidth: '400px' }}>
        <span style={{ color: 'var(--text-muted)' }}>🔍</span>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or skill…"
        />
        {searchInput && (
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px' }}
            onClick={() => { setSearchInput(''); fetchCandidates(''); }}
          >
            ×
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <div className="spinner" style={{ margin: '0 auto 12px' }} />
          Loading candidates…
        </div>
      ) : candidates.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">{search ? '🔍' : '👥'}</div>
            <div className="empty-title">
              {search ? `No results for "${search}"` : 'No candidates yet'}
            </div>
            {!search && (
              <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => onNavigate('add-candidate')}>
                + Add First Candidate
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {candidates.map((c) => (
            <CandidateCard key={c._id} candidate={c} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
