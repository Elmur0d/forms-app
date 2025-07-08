import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

function HomePage() {
  const [publicTemplates, setPublicTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicTemplates = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/templates`);
        setPublicTemplates(response.data);
      } catch (error) {
        console.error("Failed to fetch public templates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicTemplates();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Добро пожаловать в FormsApp!</h1>
      <p>Здесь вы можете найти и заполнить формы, созданные другими пользователями.</p>
      <h2>Публичные шаблоны</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : publicTemplates.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {publicTemplates.map(template => (
            <div key={template.id} style={{ border: '1px solid #ccc', padding: '15px' }}>
              <h3>{template.title}</h3>
              <p>Автор: {template.author.name || 'Аноним'}</p>
              <Link to={`/form/${template.id}`}>
                <button>Заполнить форму</button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Пока нет ни одного публичного шаблона.</p>
      )}
    </div>
  );
}

export default HomePage;