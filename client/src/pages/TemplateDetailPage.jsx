import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

function TemplateDetailPage() {
  const { id } = useParams(); 
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/templates/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTemplate(response.data);
      } catch (err) {
        setError('Не удалось загрузить шаблон или у вас нет доступа');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id, token]);

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!template) return <div>Шаблон не найден.</div>;

  return (
    <div>
      <Link to="/dashboard">← Назад в личный кабинет</Link>
      <h1>{template.title}</h1>
      <p><strong>Описание:</strong> {template.description || 'Нет описания'}</p>
      <hr />
      <h2>Вопросы:</h2>
      {template.questions.length > 0 ? (
        <ul>
          {template.questions.map((q) => (
            <li key={q.id}>{q.title} ({q.type})</li>
          ))}
        </ul>
      ) : (
        <p>В этом шаблоне еще нет вопросов.</p>
      )}
    </div>
  );
}

export default TemplateDetailPage;