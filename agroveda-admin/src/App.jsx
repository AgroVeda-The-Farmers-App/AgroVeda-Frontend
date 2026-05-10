import { useState, useEffect } from "react";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import "./index.css";

export default function App() {
  const [admin, setAdmin] = useState(null);

  // Check existing session on load
  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    const token  = localStorage.getItem("adminToken");
    if (stored && token) {
      setAdmin(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdmin(null);
  };

  if (!admin) {
    return <AdminLogin onLogin={setAdmin} />;
  }

  return <AdminDashboard admin={admin} onLogout={handleLogout} />;
}