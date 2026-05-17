import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Candidates
export const addCandidate = (data) => api.post('/candidates', data);
export const getCandidates = (search = '') =>
  api.get('/candidates', { params: search ? { search } : {} });
export const deleteCandidate = (id) => api.delete(`/candidates/${id}`);
export const getCandidate = (id) => api.get(`/candidates/${id}`);

// Match
export const matchCandidates = (data) => api.post('/match', data);

// AI
export const aiShortlist = (data) => api.post('/ai/shortlist', data);
export const aiInterviewQuestions = (data) => api.post('/ai/interview-questions', data);

export default api;
