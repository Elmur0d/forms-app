import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (term.trim()) {
      navigate(`/search?term=${term}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Найти шаблон..."
      />
      <button type="submit" style={{ marginLeft: '5px' }}>Найти</button>
    </form>
  );
}

export default SearchBar;