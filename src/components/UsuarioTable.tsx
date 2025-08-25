import type { Usuario } from "../types/Usuario";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  usuarios: Usuario[];
  onEditar: (usuario: Usuario) => void;
  onDeletar: (id: string) => void;
}

export function UsuarioTable({ usuarios, onEditar, onDeletar }: Props) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Nome</th>
            <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Email</th>
            <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Data de Criação</th>
            <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {usuarios.length > 0 ? (
            usuarios.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50 transition-colors duration-200">
                <td className="p-4 whitespace-nowrap">
                  <div className="font-medium text-slate-800">{u.nome}</div>
                </td>
                <td className="p-4 text-slate-600">{u.email}</td>
                <td className="p-4 text-sm text-slate-500">
                  {u.data_criacao
                    ? new Date(u.data_criacao).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"}
                </td>
                <td className="p-4 flex justify-center items-center gap-4">
                  <button
                    className="text-slate-500 hover:text-blue-600 transition-colors"
                    onClick={() => onEditar(u)}
                    title="Editar"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="text-slate-500 hover:text-red-600 transition-colors"
                    onClick={() => onDeletar(u._id)}
                    title="Remover"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-8 text-slate-500">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
