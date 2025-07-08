import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav style={{ background: '#333', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
        FormsApp
      </Link>
      <div>
        {user ? (
          <>
            <Link to="/dashboard" style={{ color: 'white', marginRight: '1rem' }}>
              Личный кабинет
            </Link>
            <button onClick={logout}>Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', marginRight: '1rem' }}>
              Войти
            </Link>
            <Link to="/register" style={{ color: 'white' }}>
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;