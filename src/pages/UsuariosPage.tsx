import { useState, useEffect } from "react";
import { UsuarioTable } from "../components/UsuarioTable";
import { UsuarioForm } from "../components/UsuarioForm";
import { Modal } from "../components/Modal";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";

export default function UsuariosPage({ onLogout }: { onLogout: () => void }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string>("");
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    try {
      const { data } = await api.get("/usuarios");
      if (Array.isArray(data.data)) setUsuarios(data.data);
      else setError("Resposta inválida do servidor");
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

  async function handleSave(payload: Omit<Usuario, "_id" | "data_criacao" | "senha"> & { senha?: string }, _id?: string) {
    try {
      if (_id) {
        // Edição
        const res = await api.put(`/usuarios/${_id}`, payload);
        setUsuarios(prev => prev.map(u => u._id === _id ? res.data : u));
        alert("Usuário atualizado!");
      } else {
        // Criação
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Painel de Usuários</h1>
        <div className="flex gap-2">
          <button
            onClick={() => { setUsuarioEditando(null); setModalOpen(true); }}
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

      <UsuarioTable usuarios={usuarios} onEditar={handleEdit} onDeletar={handleDelete} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={usuarioEditando ? "Editar Usuário" : "Criar Usuário"}>
        <UsuarioForm usuarioEditando={usuarioEditando} onSave={handleSave} cancelEdit={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
