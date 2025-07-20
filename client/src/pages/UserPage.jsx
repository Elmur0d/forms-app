import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useTemplateStore from '../store/templateStore';
import useAuthStore from '../store/authStore';
import CreateTemplateModal from '../components/CreateTemplateModal';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

function UserPage() {
  const { user } = useAuthStore();
  const { myTemplates, isLoading: templatesLoading, fetchMyTemplates, deleteTemplate } = useTemplateStore();
  
  const [mySubmissions, setMySubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  
  const [sharedTemplates, setSharedTemplates] = useState([]);
  const [sharedLoading, setSharedLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('templates'); 

  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    fetchMyTemplates();

    const fetchMySubmissions = async () => {
      setSubmissionsLoading(true);
      try {
        const token = useAuthStore.getState().token;
        const response = await axios.get(`${API_URL}/api/forms/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMySubmissions(response.data);
      } catch (error) {
        console.error("Failed to fetch user's submissions:", error);
      } finally {
        setSubmissionsLoading(false);
      }
    };
    
    const fetchSharedTemplates = async () => {
      setSharedLoading(true);
      try {
        const token = useAuthStore.getState().token;
        const { data } = await axios.get(`${API_URL}/api/templates/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSharedTemplates(data);
      } catch (error) {
        console.error("Failed to fetch shared templates:", error);
      } finally {
        setSharedLoading(false);
      }
    };

    fetchMySubmissions();
    fetchSharedTemplates();
  }, [fetchMyTemplates]);

  const handleDeleteTemplate = (templateId) => {
      if (window.confirm('Вы уверены, что хотите удалить этот шаблон? Все связанные с ним вопросы и ответы будут также удалены.')) {
          deleteTemplate(templateId);
      }
    };

  return (
    <div>
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать, {user?.name || user?.email}!</p>
      
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #555', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('templates')} disabled={activeTab === 'templates'}>Мои шаблоны</button>
        <button onClick={() => setActiveTab('submissions')} disabled={activeTab === 'submissions'} style={{ marginLeft: '10px' }}>Мои ответы</button>
        <button onClick={() => setActiveTab('shared')} disabled={activeTab === 'shared'} style={{ marginLeft: '10px' }}>Доступные мне</button>
      </div>

      {activeTab === 'templates' && (
        <div>
          <h2>Мои шаблоны</h2>
          <button onClick={() => setIsModalOpen(true)}>+ Создать новый шаблон</button>
          {templatesLoading ? <p>Загрузка...</p> : (
            myTemplates.length > 0 ? (
              <ul>
                {myTemplates.map((template) => (
                  <li key={template.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Link to={`/template/${template.id}`}>{template.title}</Link>
                      <span style={{ marginLeft: '10px', fontSize: '0.8em', color: '#888' }}>({template.topic})</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteTemplate(template.id)} 
                      style={{ background: '#8B0000' }}
                    >
                      Удалить
                    </button>
                  </li>
                ))}
              </ul>
            ) : <p>У вас еще нет созданных шаблонов.</p>
          )}
        </div>
      )}

      {activeTab === 'submissions' && (
        <div>
          <h2>Мои ответы</h2>
          {submissionsLoading ? <p>Загрузка...</p> : (
            mySubmissions.length > 0 ? (
              <ul>
                {mySubmissions.map((sub) => (
                  <li key={sub.id}>
                    Вы заполнили форму <Link to={`/form/${sub.template.id}`}><strong>{sub.template.title}</strong></Link>
                    {' в '} 
                    {new Date(sub.createdAt).toLocaleString()}
                    {' - '}
                    <Link to={`/submission/${sub.id}`}>Посмотреть мои ответы</Link>
                  </li>
                ))}
              </ul>
            ) : <p>Вы еще не заполнили ни одной формы.</p>
          )}
        </div>
      )}

      {activeTab === 'shared' && (
        <div>
          <h2>Шаблоны, к которым вам предоставили доступ</h2>
          {sharedLoading ? <p>Загрузка...</p> : (
            sharedTemplates.length > 0 ? (
              <ul>
                {sharedTemplates.map((template) => (
                  <li key={template.id}>
                    <Link to={`/form/${template.id}`}>{template.title}</Link>
                    <span style={{ marginLeft: '10px', fontSize: '0.8em', color: '#888' }}>
                      (автор: {template.author.name})
                    </span>
                  </li>
                ))}
              </ul>
            ) : <p>Вам еще не предоставили доступ ни к одному приватному шаблону.</p>
          )}
        </div>
      )}

      <CreateTemplateModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default UserPage;