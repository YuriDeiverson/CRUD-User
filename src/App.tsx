import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UsuariosPage from "./pages/UsuariosPage";

function App() {
  const [token, setToken] = useState<string | null>(null);

  // Lê o token do localStorage ao iniciar o app
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // Função para logout
  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Página inicial */}
        <Route
          path="/"
          element={token ? <Navigate to="/usuarios" /> : <Navigate to="/login" />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={token ? <Navigate to="/usuarios" /> : <LoginPage />}
        />

        {/* Registro */}
        <Route
          path="/register"
          element={token ? <Navigate to="/usuarios" /> : <RegisterPage />}
        />

        {/* Página de usuários */}
        <Route
          path="/usuarios"
          element={token ? <UsuariosPage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        {/* Qualquer outra rota desconhecida */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
