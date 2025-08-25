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

  // Carregar usuários ao iniciar a página
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ⚡ Aqui pegamos o array real dentro da propriedade `data`
        setUsuarios(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar usuários.");
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
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Painel de Usuários</h1>
        <button
          onClick={onLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </header>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
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
              <tr key={usuario.id} className="border-t border-gray-200 hover:bg-gray-50 transition">
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
                  <button
                    onClick={() => alert("Funcionalidade criar novo usuário")}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Novo Usuário
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
