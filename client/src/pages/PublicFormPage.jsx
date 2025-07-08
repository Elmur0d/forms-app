import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

function PublicFormPage() {
  const { id } = useParams();
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuthStore();

  const fetchTemplate = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/templates/${id}`);
      const sortedQuestions = response.data.questions.sort((a, b) => a.order - b.order);
      setTemplate({ ...response.data, questions: sortedQuestions });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTemplate();
  }, [fetchTemplate]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        alert('Пожалуйста, войдите в систему, чтобы отправить форму.');
        return;
    }
    try {
      await axios.post(`${API_URL}/api/forms`, 
        { templateId: id, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Форма успешно отправлена!');
    } catch (err) {
      alert('Ошибка при отправке.');
    }
  };
  
  if (loading) return <div>Загрузка...</div>;
  if (!template) return <div>Шаблон не найден или у вас нет доступа.</div>;

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>{template.title}</h1>
      <p>{template.description}</p>
      <hr/>
      <form onSubmit={handleSubmit}>
        {template.questions.map(q => (
          <div key={q.id} style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>{q.title}</label>
            {q.type === 'multi-line' ? (
              <textarea 
                onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                style={{ width: '100%', minHeight: '80px' }}
              />
            ) : (
              <input 
                type={q.type === 'integer' ? 'number' : 'text'} 
                onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                style={{ width: '100%' }}
              />
            )}
          </div>
        ))}
        <hr/>
        {user ? (
          <button type="submit">Отправить</button>
        ) : (
          <p>Пожалуйста, <a href="/login">войдите</a>, чтобы отправить форму.</p>
        )}
      </form>
    </div>
  );
}

export default PublicFormPage;