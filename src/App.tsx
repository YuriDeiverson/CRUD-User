import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UsuariosPage from "./pages/UsuariosPage";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/usuarios" /> : <LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/usuarios" element={token ? <UsuariosPage /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;