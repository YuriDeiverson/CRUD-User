import { useEffect, useState } from "react";
import api from "../services/api";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/solid";

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
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    try {
      const { data } = await api.get("/usuarios");
      if (Array.isArray(data.data)) {
        setUsuarios(data.data);
      } else {
        console.error("Resposta inválida:", data);
        setError("Erro ao carregar usuários.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar usuários.");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja deletar este usuário?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios(prev => prev.filter(u => u.id !== id));
    } catch (err: any) {
      console.error(err);
      alert("Erro ao deletar usuário.");
    }
  }

  async function handleCreate() {
    const novoNome = prompt("Nome do usuário:");
    const novoEmail = prompt("E-mail do usuário:");
    const novaSenha = prompt("Senha do usuário:");
    if (!novoNome || !novoEmail || !novaSenha) return;

    try {
      const res = await api.post("/usuarios/register", {
        nome: novoNome,
        email: novoEmail,
        senha: novaSenha,
      });
      setUsuarios(prev => [...prev, res.data]);
      alert("Usuário criado com sucesso!");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) {
        alert("Usuário já existe.");
      } else {
        alert("Erro ao criar usuário.");
      }
    }
  }

  function openEditModal(usuario: Usuario) {
    setEditingUsuario(usuario);
    setNome(usuario.nome);
    setEmail(usuario.email);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUsuario) return;

    try {
      const res = await api.put(`/usuarios/${editingUsuario.id}`, { nome, email });
      setUsuarios(prev =>
        prev.map(u => (u.id === editingUsuario.id ? res.data : u))
      );
      setEditingUsuario(null);
      alert("Usuário atualizado com sucesso!");
    } catch (err: any) {
      console.error(err);
      alert("Erro ao atualizar usuário.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Painel de Usuários</h1>
        <div className="flex gap-2">
          <button
            onClick={handleCreate}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Criar Novo Usuário
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
                  onClick={() => openEditModal(usuario)}
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

      {/* Modal de edição */}
      {editingUsuario && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md relative space-y-4"
          >
            <button
              type="button"
              onClick={() => setEditingUsuario(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Editar Usuário</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nome
                </label>
                <input
                  className="block w-full border border-slate-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  className="block w-full border border-slate-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="group w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold px-4 py-3 rounded-lg hover:shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500"
            >
              Salvar
              <ArrowRightIcon className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
