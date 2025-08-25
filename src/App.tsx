import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // 👈 novo
import UsuariosPage from "./pages/UsuariosPage";
import type { ReactNode } from "react";

function PrivateRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* 👈 novo */}
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <UsuariosPage />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/usuarios" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
