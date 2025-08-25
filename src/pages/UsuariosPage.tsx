// frontend/src/pages/UsuariosPage.tsx
import { useEffect, useState } from "react";
import api from "../services/api";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  data_criacao?: string;
}

interface UsuariosPageProps {
  onLogout: () => void;
}

export default function UsuariosPage({ onLogout }: UsuariosPageProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Se o backend retornar { usuarios: [...] }, use data.usuarios
        // Se retornar o array diretamente, use data
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else if (Array.isArray(data.usuarios)) {
          setUsuarios(data.usuarios);
        } else {
          setUsuarios([]);
          console.warn("Resposta inesperada do backend:", data);
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar usuários.");
      }
    }

    fetchUsuarios();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar usuário.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Painel de Usuários</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </header>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <table className="w-full bg-white shadow-xl rounded-2xl overflow-hidden">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="p-4">ID</th>
            <th className="p-4">Nome</th>
            <th className="p-4">Email</th>
            <th className="p-4">Data de Criação</th>
            <th className="p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(usuarios) && usuarios.length > 0 ? (
            usuarios.map(usuario => (
              <tr key={usuario.id} className="border-t border-slate-200">
                <td className="p-4">{usuario.id}</td>
                <td className="p-4">{usuario.nome}</td>
                <td className="p-4">{usuario.email}</td>
                <td className="p-4">{usuario.data_criacao || "-"}</td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => alert("Editar funcionalidade ainda não implementada")}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4 text-slate-500">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
