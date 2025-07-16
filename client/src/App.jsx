import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import UserPage from './pages/UserPage.jsx';
import TemplateDetailPage from './pages/TemplateDetailPage.jsx';
import PublicFormPage from './pages/PublicFormPage.jsx';
import useAuthStore from './store/authStore.js';
import Navbar from './components/Navbar.jsx'; 
import HomePage from './pages/HomePage.jsx'; 
import SubmissionDetailPage from './pages/SubmissionDetailPage.jsx';
import useThemeStore from './store/themeStore';
import SearchResultsPage from './pages/SearchResultsPage.jsx';


function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  
  return (
    <BrowserRouter>
      <Navbar />
      <main> 
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/form/:id" element={<PublicFormPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
          <Route path="/template/:id" element={<ProtectedRoute><TemplateDetailPage /></ProtectedRoute>} />
          <Route path="/submission/:id" element={<ProtectedRoute><SubmissionDetailPage /></ProtectedRoute>} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;