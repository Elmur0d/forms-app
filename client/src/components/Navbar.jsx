import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';
import HelpTicketModal from './HelpTicketModal';
import SearchBar from './SearchBar';

function Navbar() {
  const { t, i18n } = useTranslation(); 
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <nav style={{ background: '#333', color: 'white', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem' }}>
          FormsApp
        </Link>
        <SearchBar />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => changeLanguage('ru')} disabled={i18n.language === 'ru'} style={{ marginRight: '5px' }}>RU</button>
          <button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'} style={{ marginRight: '1rem' }}>EN</button>
          
          <button onClick={() => setHelpModalOpen(true)} style={{ marginRight: '1rem' }}>
            {t('nav.help')}
          </button>
          
          <button onClick={toggleTheme} style={{ marginRight: '1rem' }}>
            {theme === 'dark' ? t('nav.theme_light') : t('nav.theme_dark')}
          </button>
          
          {user ? (
            <>
              {user.role === 'ADMIN' && ( <Link to="/admin" style={{ color: 'yellow', marginRight: '1rem' }}> {t('nav.admin_panel', 'Админ-панель')} </Link> )}
              <Link to="/dashboard" style={{ color: 'white', marginRight: '1rem' }}>
                {t('nav.dashboard')}
              </Link>
              <a href="/login" onClick={useAuthStore.getState().logout} style={{ color: 'white', cursor: 'pointer' }}>{t('nav.logout')}</a>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'white', marginRight: '1rem' }}>
                {t('nav.login')}
              </Link>
              <Link to="/register" style={{ color: 'white' }}>
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      </nav>
      <HelpTicketModal isOpen={isHelpModalOpen} onRequestClose={() => setHelpModalOpen(false)} />
    </>
  );
}

export default Navbar;