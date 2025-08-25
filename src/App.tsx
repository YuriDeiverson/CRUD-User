import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UsuariosPage from "./pages/UsuariosPage";

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  function handleLogin(newToken: string) {
    localStorage.setItem("token", newToken);
    setToken(newToken); // ⚡ atualiza o estado e rerenderiza
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null); // ⚡ rerenderiza e redireciona para login
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/usuarios" /> : <Navigate to="/login" />} />
        <Route path="/login" element={token ? <Navigate to="/usuarios" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/register" element={token ? <Navigate to="/usuarios" /> : <RegisterPage />} />
        <Route path="/usuarios" element={token ? <UsuariosPage onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
