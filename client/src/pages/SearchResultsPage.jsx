import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const term = searchParams.get('term');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!term) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/search?term=${term}`);
        setResults(response.data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [term]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Результаты поиска по запросу: "{term}"</h1>
      {loading ? (
        <p>Идет поиск...</p>
      ) : results.length > 0 ? (
        results.map(template => (
          <div key={template.id} style={{ border: '1px solid #444', padding: '15px', marginBottom: '15px' }}>
            <h3>{template.title}</h3>
            <p>Автор: {template.author.name}</p>
            <Link to={`/form/${template.id}`}><button>Перейти к форме</button></Link>
          </div>
        ))
      ) : (
        <p>Ничего не найдено.</p>
      )}
    </div>
  );
}

export default SearchResultsPage;