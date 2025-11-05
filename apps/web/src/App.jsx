import { useState, useEffect } from "react";
import LoginForm from "./pages/LoginForm";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Kolla om användare redan är inloggad
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        console.error("Kunde inte läsa användardata");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // 🔹 När användaren loggar in
  function handleLogin(userData, token) {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  }

  // 🔹 Logga ut
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  if (loading) return <p>Laddar...</p>;

  // 🔹 Om ingen är inloggad
  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // 🔹 Om användare finns, visa rätt dashboard
  return (
    <main className="app-container">
      {user.role === "ADMIN" ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        <UserDashboard user={user} onLogout={handleLogout} />
      )}
    </main>
  );
}
