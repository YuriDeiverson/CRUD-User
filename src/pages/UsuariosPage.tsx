import { useEffect, useState } from "react";
import { UsuarioTable } from "../components/UsuarioTable";
import { UsuarioForm } from "../components/UsuarioForm";
import { Modal } from "../components/Modal";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";

export default function UsuariosPage({ onLogout }: { onLogout: () => void }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    try {
      const { data } = await api.get("/usuarios");
      if (Array.isArray(data.data)) setUsuarios(data.data);
      else setError("Resposta inválida do servidor.");
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar usuários.");
    }
  }

  async function handleDelete(id?: string) {
    if (!id || !confirm("Deseja deletar este usuário?")) return;
    try {
      await api.delete(`/usuarios/${id}`);
      setUsuarios(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar usuário.");
    }
  }

  function handleEdit(usuario: Usuario) {
    setUsuarioEditando(usuario);
    setModalOpen(true);
  }

  async function handleSave(
    payload: Omit<Usuario, "_id" | "data_criacao" | "senha"> & { senha?: string },
    _id?: string
  ) {
    try {
      if (_id) {
        const res = await api.put(`/usuarios/${_id}`, payload);
        setUsuarios(prev => prev.map(u => (u._id === _id ? res.data : u)));
        alert("Usuário atualizado!");
      } else {
        const res = await api.post("/usuarios/register", payload);
        setUsuarios(prev => [...prev, res.data]);
        alert("Usuário criado!");
      }
      setModalOpen(false);
      setUsuarioEditando(null);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 409) alert("Usuário já existe.");
      else alert("Erro ao salvar usuário.");
    }
  }

  // Filtragem simples por nome ou email
  const usuariosFiltrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Painel de Usuários</h1>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setUsuarioEditando(null);
              setModalOpen(true);
            }}
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

      {/* Barra de busca + botão Adicionar */}
      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          placeholder="Pesquisar por nome ou e-mail..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            setUsuarioEditando(null);
            setModalOpen(true);
          }}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center shadow"
        >
          <span className="text-xl mr-2">+</span> Adicionar Usuário
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <UsuarioTable
        usuarios={usuariosFiltrados}
        onEditar={handleEdit}
        onDeletar={handleDelete}
      />

      {/* Paginação (exemplo estático, para simular o visual) */}
      <div className="flex justify-center mt-4 gap-2">
        <button className="px-4 py-1 border rounded hover:bg-slate-100 text-sm">Anterior</button>
        <span className="px-4 py-1 text-slate-600 text-sm">Página 2</span>
        <button className="px-4 py-1 border rounded hover:bg-slate-100 text-sm">Próxima</button>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={usuarioEditando ? "Editar Usuário" : "Criar Usuário"}
      >
        <UsuarioForm
          usuarioEditando={usuarioEditando}
          onSave={handleSave}
          cancelEdit={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
