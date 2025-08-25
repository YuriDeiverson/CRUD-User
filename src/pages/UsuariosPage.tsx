import { useState, useEffect } from 'react';
import api from '../services/api';
import { Modal } from '../components/Modal';
import { UsuarioForm } from '../components/UsuarioForm';
import { UsuarioTable } from '../components/UsuarioTable';
import type { Usuario } from '../types/Usuario';
import { PlusIcon } from '@heroicons/react/24/solid';

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);

  const carregarUsuarios = () => {
    api.get(`/usuarios?page=${page}&q=${filter}`)
      .then(response => {
        setUsuarios(response.data.data);
      })
      .catch(error => console.error("Falha ao buscar usuários:", error));
  };

  useEffect(() => {
    carregarUsuarios();
  }, [page, filter]);

  const handleSaveUser = (novoUsuario: Omit<Usuario, '_id' | 'data_criacao'>, _id?: string) => {
    const promise = _id
      ? api.put(`/usuarios/${_id}`, novoUsuario)
      : api.post('/usuarios/register', novoUsuario);

    promise.then(() => {
        setIsModalOpen(false);
        setUsuarioEditando(null);
        carregarUsuarios();
      })
      .catch(error => console.error("Erro ao salvar usuário:", error));
  };
  
  const handleEdit = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setIsModalOpen(true);
  };
  
  const handleDelete = (_id?: string) => {
    if (_id && window.confirm('Tem certeza que deseja remover este usuário? Esta ação é irreversível.')) {
      api.delete(`/usuarios/${_id}`).then(() => {
        carregarUsuarios();
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-slate-900">
                Painel de Usuários
            </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white p-4 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-grow w-full">
            <input 
              type="text" 
              value={filter} 
              onChange={e => setFilter(e.target.value)} 
              placeholder="Pesquisar por nome ou e-mail..."
              className="w-full p-3 pl-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <button 
            onClick={() => { setUsuarioEditando(null); setIsModalOpen(true); }}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-5 py-3 rounded-lg hover:shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            <PlusIcon className="h-5 w-5" />
            Adicionar Usuário
          </button>
        </div>

        <UsuarioTable usuarios={usuarios} onEditar={handleEdit} onDeletar={handleDelete} />

        <div className="mt-8 flex justify-center items-center gap-4">
          <button 
            onClick={() => setPage(p => Math.max(p - 1, 1))} 
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Anterior
          </button>
          <span className="text-sm font-semibold text-slate-600">Página {page}</span>
          <button 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Próxima
          </button>
        </div>
      </main>

      <Modal 
        open={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setUsuarioEditando(null); }} 
        title={usuarioEditando ? "Editar Usuário" : "Criar Novo Usuário"}
      >
        <UsuarioForm 
          onSave={handleSaveUser} 
          usuarioEditando={usuarioEditando} 
          cancelEdit={() => { setIsModalOpen(false); setUsuarioEditando(null); }} 
        />
      </Modal>
    </div>
  );
}

export default UsuariosPage;
