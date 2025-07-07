import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import useAuthStore from './store/authStore.js';


function Dashboard() {
  const { user, logout } = useAuthStore();
  return (
    <div>
      <h1>Добро пожаловать, {user?.name || user?.email}!</h1>
      <p>Вы успешно вошли в систему. Перезагрузите страницу, и вы останетесь здесь.</p>
      <button onClick={logout}>Выйти</button>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { token, _hasHydrated } = useAuthStore();

  if (!_hasHydrated) {
    return <div>Загрузка...</div>;
  }

  return token ? children : <Navigate to="/login" />;
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;