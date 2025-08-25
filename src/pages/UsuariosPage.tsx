// frontend/src/pages/UsuariosPage.tsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { Modal } from "../components/Modal";

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [novoNome, setNovoNome] = useState<string>("");
  const [novoEmail, setNovoEmail] = useState<string>("");
  const [novaSenha, setNovaSenha] = useState<string>("");

  // Carregar usuários ao iniciar a página
  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const { data } = await api.get("/usuarios");
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          console.error("Resposta inválida:", data);
          setError("Erro ao carregar usuários.");
        }
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar usuários.");
      }
    }
    fetchUsuarios();
  }, []);

  // Criar novo usuário
  async function handleCreate() {
    if (!novoNome || !novoEmail || !novaSenha) {
      alert("Preencha todos os campos.");
      return;
    }
    try {
      const { data } = await api.post("/usuarios/register", {
        nome: novoNome,
        email: novoEmail,
        senha: novaSenha,
      });
      setUsuarios(prev => [...prev, data]);
      setIsModalOpen(false);
      setNovoNome("");
      setNovoEmail("");
      setNovaSenha("");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar usuário.");
    }
  }

  // Deletar usuário
  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;

    try {
      await api.delete(`/usuarios/${id}`);
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
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Criar Usuário
          </button>
          <button
            onClick={onLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
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

      {/* Modal de criação de usuário */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Criar Novo Usuário">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={novoNome}
            onChange={e => setNovoNome(e.target.value)}
            className="block w-full border border-slate-300 p-3 rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            value={novoEmail}
            onChange={e => setNovoEmail(e.target.value)}
            className="block w-full border border-slate-300 p-3 rounded-lg"
          />
          <input
            type="password"
            placeholder="Senha"
            value={novaSenha}
            onChange={e => setNovaSenha(e.target.value)}
            className="block w-full border border-slate-300 p-3 rounded-lg"
          />
          <button
            onClick={handleCreate}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Criar
          </button>
        </div>
      </Modal>
    </div>
  );
}
