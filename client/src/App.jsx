import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import RegistrationPage from './pages/RegistrationPage';
import useAuthStore from './store/authStore';
import './App.css'




// Защищенный компонент для дашборда
function Dashboard() {
  const { user, logout } = useAuthStore();
  return (
    <div>
      <h1>Добро пожаловать, {user?.name || user?.email}!</h1>
      <button onClick={logout}>Выйти</button>
    </div>
  );
}

// Компонент для защиты роутов
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

// function App() {
//   const [templates, setTemplates] = useState([]);

//   useEffect(() => {
//     fetch('/api/templates')
//       .then(res => res.json())
//       .then(setTemplates);
//   }, []);

//   return (
//     <>
//       {templates.map(template => (
//         <div key={template.id}>{template.title}</div>
//       ))}
//     </>
//   )
// }

// export default App
