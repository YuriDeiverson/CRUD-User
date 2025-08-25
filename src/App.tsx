import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UsuariosPage from "./pages/UsuariosPage";

function App() {
  const token = localStorage.getItem("token");

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login"; // força redirecionamento
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Página raiz */}
        <Route path="/" element={token ? <Navigate to="/usuarios" /> : <Navigate to="/login" />} />

        {/* Login */}
        <Route path="/login" element={token ? <Navigate to="/usuarios" /> : <LoginPage />} />

        {/* Registro */}
        <Route path="/register" element={token ? <Navigate to="/usuarios" /> : <RegisterPage />} />

        {/* Usuários */}
        <Route path="/usuarios" element={token ? <UsuariosPage onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
