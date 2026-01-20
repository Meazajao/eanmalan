// apps/web/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginForm from "./pages/LoginForm.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminTicketPage from "./pages/AdminTicketPage.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes.jsx";
import { me } from "./api.js";
import "./App.css";

function AppWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const backendUser = await me();
        if (mounted && backendUser) setUser(backendUser);
      } catch {
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    navigate(userData.role === "ADMIN" ? "/admin" : "/user");
  }

  function handleLogout() {
    setUser(null);
    navigate("/login");
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-xl font-semibold text-gray-500">Laddar...</p></div>;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
      <Route path="/user" element={<ProtectedRoute user={user} requiredRole="USER"><UserDashboard user={user} onLogout={handleLogout} /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute user={user} requiredRole="ADMIN"><AdminDashboard user={user} onLogout={handleLogout} /></ProtectedRoute>} />
      <Route
  path="/admin/tickets/:id"
  element={
    <ProtectedRoute user={user} requiredRole="ADMIN">
      <AdminTicketPage user={user} onLogout={handleLogout} />
    </ProtectedRoute>
  }
/>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <Router><AppWrapper /></Router>;
}
