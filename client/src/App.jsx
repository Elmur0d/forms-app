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
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useAuthStore.persist.onRehydrate(() => setHydrated(true));
    return () => {
      unsub();
    };
  }, []);

  if (!hydrated) {
    return null;
  }

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
        <Route path="*" element={<Navigate to="/regsiter" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

