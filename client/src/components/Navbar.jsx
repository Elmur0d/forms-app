import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import HelpTicketModal from './HelpTicketModal'; 

function Navbar() {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isHelpModalOpen, setHelpModalOpen] = useState(false); 

  return (
    <>
      <nav style={{ background: '#333', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
          FormsApp
        </Link>
        <div>
          <button onClick={() => setHelpModalOpen(true)} style={{ marginRight: '1rem' }}>
            Помощь
          </button>
          
          <button onClick={toggleTheme} style={{ marginRight: '1rem' }}>
            {theme === 'dark' ? 'Светлая' : 'Темная'} тема
          </button>
          
          {user ? (
            <>
              {user.role === 'ADMIN' && (
                <Link to="/admin" style={{ color: 'yellow', marginRight: '1rem' }}>
                  Админ-панель
                </Link>
              )}
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
      <HelpTicketModal 
        isOpen={isHelpModalOpen}
        onRequestClose={() => setHelpModalOpen(false)}
      />
    </>
  );
}

export default Navbar;