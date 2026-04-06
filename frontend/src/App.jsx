import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Recommendations from './pages/Recommendations';
import UniversityDetail from './pages/UniversityDetail';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/recommendations" element={<PrivateRoute><Recommendations /></PrivateRoute>} />
        <Route path="/university/:name" element={<PrivateRoute><UniversityDetail /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}