import React, { useEffect, useState } from 'react';
import useTemplateStore from '../store/templateStore';
import useAuthStore from '../store/authStore';
import CreateTemplateModal from '../components/CreateTemplateModal';

function UserPage() {
  const { user, logout } = useAuthStore();
  const { myTemplates, isLoading, fetchMyTemplates } = useTemplateStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMyTemplates();
  }, [fetchMyTemplates]);

  return (
    <div>
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать, {user?.name || user?.email}!</p>
      <button onClick={logout}>Выйти</button>
      <hr />
      
      <h2>Мои шаблоны</h2>
      <button onClick={() => setIsModalOpen(true)}>+ Создать новый шаблон</button>

      {isLoading && <p>Загрузка...</p>}

      {myTemplates.length > 0 ? (
        <ul>
          {myTemplates.map((template) => (
            <li key={template.id}>{template.title}</li>
          ))}
        </ul>
      ) : (
        !isLoading && <p>У вас еще нет созданных шаблонов.</p>
      )}

      <CreateTemplateModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default UserPage;