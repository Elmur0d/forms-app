import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_BASE_URL || '';

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: adminUser, token } = useAuthStore();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  const handleToggleAdmin = async (userId) => {
    try {
      await axios.put(`${API_URL}/api/users/${userId}/toggle-admin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      alert('Не удалось изменить роль');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Вы уверены, что хотите навсегда удалить этого пользователя и все его данные?')) {
      try {
        const response = await axios.delete(`${API_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(response.data.msg);
        fetchUsers();
      } catch (error) {
        alert(error.response?.data?.msg || 'Не удалось удалить пользователя');
      }
    }
  };

  if (loading) return <div>Загрузка пользователей...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Управление пользователями</h1>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '8px', borderBottom: '1px solid #555' }}>ID</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #555' }}>Имя</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #555' }}>Email</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #555' }}>Роль</th>
            <th style={{ padding: '8px', borderBottom: '1px solid #555' }}>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td style={{ padding: '8px', borderBottom: '1px solid #444' }}>{user.id}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #444' }}>{user.name}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #444' }}>{user.email}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #444' }}>{user.role}</td>
              <td style={{ padding: '8px', borderBottom: '1px solid #444' }}>
                
                {adminUser.id !== user.id && (
                  <>
                    <button onClick={() => handleToggleAdmin(user.id)} style={{ marginRight: '10px' }}>
                      {user.role === 'ADMIN' ? 'Убрать админа' : 'Сделать админом'}
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} style={{ background: '#8B0000' }}>
                      Удалить
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;