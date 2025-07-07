import React, { useEffect } from 'react';
import useTemplateStore from '../store/templateStore';
import useAuthStore from '../store/authStore';

function UserPage() {
  const { user, logout } = useAuthStore();
  const { myTemplates, isLoading, fetchMyTemplates } = useTemplateStore();

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
      <button>+ Создать новый шаблон</button>

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
    </div>
  );
}

export default UserPage;