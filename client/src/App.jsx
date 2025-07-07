import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import useAuthStore from './store/authStore.js';

function Dashboard() {
  const { user, logout } = useAuthStore();
  return (
    <div>
      <h1>Добро пожаловать, {user?.name || user?.email}!</h1>
      <p>Теперь вы можете перезагрузить страницу и останетесь в системе.</p>
      <button onClick={logout}>Выйти</button>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div>Загрузка...</div>; 
  }
  
  const token = useAuthStore.getState().token;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <RegistrationPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;