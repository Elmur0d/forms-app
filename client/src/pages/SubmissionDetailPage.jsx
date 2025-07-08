// client/src/pages/SubmissionDetailPage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

function SubmissionDetailPage() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/forms/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmission(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id, token]);

  if (loading) return <div>Загрузка...</div>;
  if (!submission) return <div>Результаты не найдены.</div>;

  const answersMap = new Map(submission.answers.map(ans => [ans.questionId, ans.value]));

  return (
    <div>
      <Link to={`/template/${submission.templateId}`}>← Назад к шаблону</Link>
      <h1>{submission.template.title}</h1>
      <p>Форма заполнена: <strong>{submission.user.name || submission.user.email}</strong></p>
      <p>Дата: {new Date(submission.createdAt).toLocaleString()}</p>
      <hr />
      <h2>Ответы:</h2>
      {submission.template.questions.map(q => (
        <div key={q.id} style={{ border: '1px solid #444', padding: '10px', marginBottom: '10px' }}>
          <strong>{q.title}</strong>
          <p style={{ background: '#333', padding: '5px', marginTop: '5px' }}>
            {answersMap.get(q.id) || 'Нет ответа'}
          </p>
        </div>
      ))}
    </div>
  );
}

export default SubmissionDetailPage;