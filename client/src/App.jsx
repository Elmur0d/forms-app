import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegistrationPage from './pages/RegistrationPage.jsx';
import useAuthStore from './store/authStore.js';
import './App.css'




function Dashboard() {
  const { user, logout } = useAuthStore();
  return (
    <div>
      <h1>Добро пожаловать, {user?.name || user?.email}!</h1>
      <button onClick={logout}>Выйти</button>
    </div>
  );
}

function ProtectedRoute({ children }) {
    const token = useAuthStore((state) => state.token);
    return token ? children : <Navigate to="/login" />;
}

function App() {

  const token = useAuthStore((state) => state.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <RegistrationPage />} /> 
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;

