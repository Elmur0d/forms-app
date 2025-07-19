import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditQuestionModal from '../components/EditQuestionModal';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

function SortableQuestionItem({ question, handleDelete, handleEdit }) {
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
      <div>
        <button onPointerDown={(e) => e.stopPropagation()} onClick={() => handleEdit(question)} style={{ color: 'lightblue', border: 'none', background: 'transparent', cursor: 'pointer', marginRight: '10px' }}>Редактировать</button>
        <button onPointerDown={(e) => e.stopPropagation()} onClick={() => handleDelete(question.id)} style={{ color: 'red', border: 'none', background: 'transparent', cursor: 'pointer' }}>Удалить</button>
      </div>
    </li>
  );
}

function TemplateDetailPage() {
    const { id } = useParams();
    const [template, setTemplate] = useState(null);
    const token = useAuthStore((state) => state.token);

    const [newQuestionTitle, setNewQuestionTitle] = useState('');
    const [newQuestionType, setNewQuestionType] = useState('single-line');
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [submissions, setSubmissions] = useState([]);

    const [isPublic, setIsPublic] = useState(true);
    const [allowedUsers, setAllowedUsers] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [userSearchResults, setUserSearchResults] = useState([]);

    const fetchTemplate = useCallback(async () => {
        try {
            const { data } = await axios.get(`${API_URL}/api/templates/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            const sortedQuestions = data.questions.sort((a, b) => a.order - b.order);
            setTemplate({ ...data, questions: sortedQuestions });
            setIsPublic(data.isPublic);
            setAllowedUsers(data.allowedUsers || []);
        } catch (err) {
            console.error(err);
        }
    }, [id, token]);
    
    const fetchSubmissions = useCallback(async () => {
        try {
          const { data } = await axios.get(`${API_URL}/api/templates/${id}/forms`, { headers: { Authorization: `Bearer ${token}` } });
          setSubmissions(data);
        } catch (err) {
          console.error("Failed to fetch submissions:", err);
        }
    }, [id, token]);

    useEffect(() => {
        fetchTemplate();
        fetchSubmissions();
    }, [fetchTemplate, fetchSubmissions]);

    useEffect(() => {
        if (userSearchTerm.length < 2) {
            setUserSearchResults([]);
            return;
        }
        const handler = setTimeout(async () => {
            const { data } = await axios.get(`${API_URL}/api/users/search?term=${userSearchTerm}`, { headers: { Authorization: `Bearer ${token}` } });
            setUserSearchResults(data.filter(user => !allowedUsers.some(au => au.id === user.id)));
        }, 300);
        return () => clearTimeout(handler);
    }, [userSearchTerm, token, allowedUsers]);

    const addUserToAllowed = (user) => {
        setAllowedUsers([...allowedUsers, user]);
        setUserSearchTerm('');
        setUserSearchResults([]);
    };

    const removeUserFromAllowed = (userId) => {
        setAllowedUsers(allowedUsers.filter(u => u.id !== userId));
    };

    const handleSettingsSave = async () => {
        try {
            const allowedUserIds = isPublic ? [] : allowedUsers.map(u => u.id);
            await axios.put(`${API_URL}/api/templates/${id}`,
                { isPublic, allowedUserIds },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Настройки сохранены!');
        } catch (err) {
            alert('Не удалось сохранить настройки');
        }
    };

    const handleAddQuestion = async (e) => { e.preventDefault(); try { await axios.post(`${API_URL}/api/templates/${id}/questions`, { title: newQuestionTitle, type: newQuestionType }, { headers: { Authorization: `Bearer ${token}` } }); setNewQuestionTitle(''); fetchTemplate(); } catch (err) { alert(err.response?.data?.msg || 'Не удалось добавить вопрос'); } };
    const handleDeleteQuestion = async (questionId) => { if (window.confirm('Вы уверены?')) { try { await axios.delete(`${API_URL}/api/questions/${questionId}`, { headers: { Authorization: `Bearer ${token}` } }); fetchTemplate(); } catch (err) { alert('Не удалось удалить вопрос'); } } };
    const handleUpdateQuestion = async (questionId, updatedData) => { try { await axios.put(`${API_URL}/api/questions/${questionId}`, updatedData, { headers: { Authorization: `Bearer ${token}` } }); setEditingQuestion(null); fetchTemplate(); } catch (err) { alert('Не удалось обновить вопрос'); } };
    const sensors = useSensors(useSensor(PointerSensor));
    const handleDragEnd = (event) => { 
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const originalQuestions = template.questions;
        const oldIndex = originalQuestions.findIndex((q) => q.id === active.id);
        const newIndex = originalQuestions.findIndex((q) => q.id === over.id);
        const reorderedQuestions = arrayMove(originalQuestions, oldIndex, newIndex);
        setTemplate(prev => ({ ...prev, questions: reorderedQuestions }));
        
        const orderedQuestionIds = reorderedQuestions.map(q => q.id);
        axios.put(`${API_URL}/api/questions/reorder`, { orderedQuestionIds }, { headers: { Authorization: `Bearer ${token}` } })
            .catch(() => {
                alert('Не удалось сохранить новый порядок.');
                setTemplate(prev => ({ ...prev, questions: originalQuestions }));
        }); 
    };

    if (!template) return <div>Загрузка...</div>;
    const questionCounts = template.questions.reduce((acc, q) => ({ ...acc, [q.type]: (acc[q.type] || 0) + 1 }), {});
    const isLimitReached = !newQuestionType || questionCounts[newQuestionType] >= 4;

    return (
        <div>
            <a href={`/form/${template.id}`} target="_blank" rel="noopener noreferrer">Открыть публичную ссылку</a>
            <hr/>
            <Link to="/dashboard">← Назад в личный кабинет</Link>
            <h1>{template.title}</h1>
            
            {template.tags && template.tags.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                    {template.tags.map(tag => (
                        <span key={tag.id} style={{ background: '#555', padding: '2px 8px', borderRadius: '12px', marginRight: '5px' }}>
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}
            <p><strong>Тема:</strong> {template.topic}</p>
            <p><strong>Описание:</strong> {template.description || 'Нет описания'}</p>
            <hr/>
            <h2>Настройки доступа</h2>
            <div>
                <input type="radio" id="public" name="access" checked={isPublic} onChange={() => setIsPublic(true)} />
                <label htmlFor="public" style={{ marginLeft: '5px' }}>Публичный (доступен всем)</label>
            </div>
            <div>
                <input type="radio" id="private" name="access" checked={!isPublic} onChange={() => setIsPublic(false)} />
                <label htmlFor="private" style={{ marginLeft: '5px' }}>Ограниченный (только для выбранных пользователей)</label>
            </div>

            {!isPublic && (
                <div style={{ border: '1px solid #555', padding: '15px', marginTop: '10px', borderRadius: '8px' }}>
                    <h4>Управление доступом</h4>
                    <input
                        type="text"
                        placeholder="Поиск пользователя по имени или email..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        style={{ width: '100%' }}
                    />
                    {userSearchResults.length > 0 && (
                        <ul style={{ border: '1px solid #555', listStyle: 'none', padding: '5px', marginTop: '5px' }}>
                            {userSearchResults.map(user => (
                                <li key={user.id} onClick={() => addUserToAllowed(user)} style={{ cursor: 'pointer', padding: '5px' }}>
                                    {user.name} ({user.email})
                                </li>
                            ))}
                        </ul>
                    )}
                    <h5 style={{marginTop: '15px'}}>Допущенные пользователи:</h5>
                    {allowedUsers.length > 0 ? (
                        <ul style={{listStyle: 'none', padding: 0}}>
                            {allowedUsers.map(user => (
                                <li key={user.id}>
                                    {user.name} ({user.email})
                                    <button onClick={() => removeUserFromAllowed(user.id)} style={{ marginLeft: '10px' }}>Удалить</button>
                                </li>
                            ))}
                        </ul>
                    ) : <p>Никто еще не добавлен.</p>}
                </div>
            )}
            <button onClick={handleSettingsSave} style={{marginTop: '10px'}}>Сохранить настройки</button>
            <hr/>
            
            <h3>Добавить новый вопрос</h3>
            <form onSubmit={handleAddQuestion}>
                <input type="text" value={newQuestionTitle} onChange={(e) => setNewQuestionTitle(e.target.value)} placeholder="Текст вопроса" required />
                <select value={newQuestionType} onChange={(e) => setNewQuestionType(e.target.value)}>
                    <option value="single-line">Однострочный текст ({questionCounts['single-line'] || 0}/4)</option>
                    <option value="multi-line">Многострочный текст ({questionCounts['multi-line'] || 0}/4)</option>
                    <option value="integer">Число ({questionCounts['integer'] || 0}/4)</option>
                    <option value="checkbox">Чекбокс ({questionCounts['checkbox'] || 0}/4)</option>
                </select>
                <button type="submit" disabled={isLimitReached}>{isLimitReached ? 'Лимит достигнут' : 'Добавить'}</button>
            </form>
            <hr />

            <h2>Результаты ({submissions.length})</h2>
            {submissions.length > 0 ? (
                <ul>
                    {submissions.map(sub => (
                        <li key={sub.id}>
                            <Link to={`/submission/${sub.id}`}>
                                Заполнено пользователем: <strong>{sub.user.name || sub.user.email}</strong> 
                                {' в '} 
                                {new Date(sub.createdAt).toLocaleString()}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (<p>Эту форму еще никто не заполнял.</p>)}

            <h2>Вопросы:</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={template.questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {template.questions.map((q) => (
                            <SortableQuestionItem key={q.id} question={q} handleDelete={handleDeleteQuestion} handleEdit={setEditingQuestion} />
                        ))}
                    </ul>
                </SortableContext>
            </DndContext>
            {template.questions.length === 0 && <p>В этом шаблоне еще нет вопросов.</p>}
            
            <EditQuestionModal
                isOpen={!!editingQuestion}
                onRequestClose={() => setEditingQuestion(null)}
                question={editingQuestion}
                onUpdate={handleUpdateQuestion}
            />
        </div>
    );
}

export default TemplateDetailPage;