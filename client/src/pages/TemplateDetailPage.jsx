import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

// Компонент для элемента списка
function SortableQuestionItem({ question, handleDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #555',
    backgroundColor: '#444',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'grab',
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span>{question.title} ({question.type})</span>
      <button
        onClick={() => handleDelete(question.id)}
        style={{ color: 'red', border: 'none', background: 'transparent', cursor: 'pointer' }}
      >
        Удалить
      </button>
    </li>
  );
}


// Основной компонент страницы
function TemplateDetailPage() {
    const { id } = useParams();
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useAuthStore((state) => state.token);
    const [newQuestionTitle, setNewQuestionTitle] = useState('');
    const [newQuestionType, setNewQuestionType] = useState('single-line');

    const fetchTemplate = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/templates/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const sortedQuestions = response.data.questions.sort((a, b) => a.order - b.order);
            setTemplate({ ...response.data, questions: sortedQuestions });
        } catch (err) {
            setError('Не удалось загрузить шаблон или у вас нет доступа');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id, token]);

    useEffect(() => {
        fetchTemplate();
    }, [fetchTemplate]);

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!newQuestionTitle) return;
        try {
            await axios.post(
                `${API_URL}/api/templates/${id}/questions`,
                { title: newQuestionTitle, type: newQuestionType },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewQuestionTitle('');
            fetchTemplate();
        } catch (err) {
            alert(err.response?.data?.msg || 'Не удалось добавить вопрос');
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот вопрос?')) {
            try {
                await axios.delete(`${API_URL}/api/questions/${questionId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchTemplate();
            } catch (err) {
                alert('Не удалось удалить вопрос');
            }
        }
    };
    
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const originalQuestions = template.questions;
            const oldIndex = originalQuestions.findIndex((q) => q.id === active.id);
            const newIndex = originalQuestions.findIndex((q) => q.id === over.id);
            
            // Создаем новый отсортированный массив
            const reorderedQuestions = arrayMove(originalQuestions, oldIndex, newIndex);

            // Обновляем UI немедленно
            setTemplate(prev => ({ ...prev, questions: reorderedQuestions }));
            
            // Формируем массив ID для отправки
            const orderedQuestionIds = reorderedQuestions.map(q => q.id);

            // Асинхронно отправляем изменения на сервер
            axios.put(`${API_URL}/api/questions/reorder`, 
                { orderedQuestionIds },
                { headers: { Authorization: `Bearer ${token}` } }
            ).catch(err => {
                // Если ошибка, откатываем UI и сообщаем пользователю
                alert('Не удалось сохранить новый порядок.');
                setTemplate(prev => ({ ...prev, questions: originalQuestions }));
            });
        }
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!template) return <div>Шаблон не найден.</div>;
    
    const questionCounts = template.questions.reduce((acc, q) => {
        acc[q.type] = (acc[q.type] || 0) + 1;
        return acc;
    }, {});
    const isLimitReached = questionCounts[newQuestionType] >= 4;

    return (
        <div>
            <Link to="/dashboard">← Назад в личный кабинет</Link>
            <h1>{template.title}</h1>
            <p><strong>Описание:</strong> {template.description || 'Нет описания'}</p>
            <hr />
            
            <form onSubmit={handleAddQuestion}>
                <h3>Добавить новый вопрос</h3>
                <input
                    type="text"
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                    placeholder="Текст вопроса"
                />
                <select value={newQuestionType} onChange={(e) => setNewQuestionType(e.target.value)}>
                    <option value="single-line">Однострочный текст ({questionCounts['single-line'] || 0}/4)</option>
                    <option value="multi-line">Многострочный текст ({questionCounts['multi-line'] || 0}/4)</option>
                    <option value="integer">Число ({questionCounts['integer'] || 0}/4)</option>
                    <option value="checkbox">Чекбокс ({questionCounts['checkbox'] || 0}/4)</option>
                </select>
                <button type="submit" disabled={isLimitReached}>
                    {isLimitReached ? 'Лимит достигнут' : 'Добавить'}
                </button>
            </form>
            <hr />
            <h2>Вопросы:</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={template.questions} strategy={verticalListSortingStrategy}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {template.questions.map((q) => (
                            <SortableQuestionItem key={q.id} id={q.id} question={q} handleDelete={handleDeleteQuestion} />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
            {template.questions.length === 0 && <p>В этом шаблоне еще нет вопросов.</p>}
        </div>
    );
}

export default TemplateDetailPage;