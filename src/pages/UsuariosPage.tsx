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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Carregar usuários ao iniciar a página
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const token = localStorage.getItem("token");
        const { data } = await api.get("/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar usuários.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsuarios();
  }, []);

  // Função para deletar usuário
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

      {loading ? (
        <p>Carregando usuários...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
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
            {usuarios.map(usuario => (
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
