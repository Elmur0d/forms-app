import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

function TemplateCard({ template }) {
  return (
    <div style={{ border: '1px solid #444', padding: '15px', borderRadius: '8px' }}>
      <h3>{template.title}</h3>
      <p>Автор: {template.author.name || 'Аноним'}</p>
      {/* Если есть счетчик, показываем популярность */}
      {template._count?.forms !== undefined && (
        <p>Заполнений: {template._count.forms}</p>
      )}
      <Link to={`/form/${template.id}`}>
        <button>Заполнить форму</button>
      </Link>
    </div>
  );
}

function HomePage() {
  const [latestTemplates, setLatestTemplates] = useState([]);
  const [popularTemplates, setPopularTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllTemplates = async () => {
      try {
        // Запрашиваем оба эндпоинта параллельно
        const [latestRes, popularRes] = await Promise.all([
          axios.get(`${API_URL}/api/templates`),
          axios.get(`${API_URL}/api/templates/popular`),
        ]);
        setLatestTemplates(latestRes.data);
        setPopularTemplates(popularRes.data);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllTemplates();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Добро пожаловать в FormsApp!</h1>
      <p>Здесь вы можете найти и заполнить формы, созданные другими пользователями.</p>
      
      <hr style={{margin: '2rem 0'}}/>

      <h2>Самые популярные</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : popularTemplates.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {popularTemplates.map(template => (
            <TemplateCard key={`popular-${template.id}`} template={template} />
          ))}
        </div>
      ) : (
        <p>Пока нет популярных шаблонов.</p>
      )}

      <hr style={{margin: '2rem 0'}}/>

      <h2>Последние добавленные</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : latestTemplates.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {latestTemplates.map(template => (
            <TemplateCard key={`latest-${template.id}`} template={template} />
          ))}
        </div>
      ) : (
        <p>Пока нет ни одного публичного шаблона.</p>
      )}
    </div>
  );
}

export default HomePage;