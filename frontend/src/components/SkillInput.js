import React, { useState } from 'react';

export default function SkillInput({ skills, onChange, placeholder = 'Type a skill and press Enter' }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.map((s) => s.toLowerCase()).includes(trimmed.toLowerCase())) {
      onChange([...skills, trimmed]);
    }
    setInput('');
  };

  const removeSkill = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    } else if (e.key === 'Backspace' && input === '' && skills.length > 0) {
      onChange(skills.slice(0, -1));
    }
  };

  return (
    <div>
      <div className="skill-input-wrapper">
        <input
          className="form-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button type="button" className="btn btn-secondary" onClick={addSkill}>
          Add
        </button>
      </div>
      {skills.length > 0 && (
        <div className="skills-list">
          {skills.map((skill, i) => (
            <span key={i} className="skill-tag">
              {skill}
              <button onClick={() => removeSkill(i)}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
