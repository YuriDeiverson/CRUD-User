// frontend/src/components/UsuarioForm.tsx

import { useState, useEffect, type InputHTMLAttributes } from "react";
import type { Usuario } from "../types/Usuario";
import { CheckIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

function FormField({ label, id, ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className="block w-full border border-slate-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>
  );
}

interface Props {
  onSave: (usuario: Omit<Usuario, "id" | "data_criacao" | "senha"> & { senha?: string }, id?: number) => void;
  usuarioEditando?: Usuario | null;
  cancelEdit?: () => void;
}

export function UsuarioForm({ onSave, usuarioEditando, cancelEdit }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    if (usuarioEditando) {
      setNome(usuarioEditando.nome);
      setEmail(usuarioEditando.email);
      setSenha("");
    } else {
      setNome("");
      setEmail("");
      setSenha("");
    }
  }, [usuarioEditando]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Omit<Usuario, 'id' | 'data_criacao' | 'senha'> & { senha?: string } = { nome, email };
    if (!usuarioEditando && senha) {
      payload.senha = senha;
    }
    onSave(payload, usuarioEditando?.id);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
      <div className="space-y-4">
        <FormField
          label="Nome"
          id="nome"
          type="text"
          placeholder="Nome completo do usuário"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <FormField
          label="Email"
          id="email-form"
          type="email"
          placeholder="exemplo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {!usuarioEditando && (
          <FormField
            label="Senha"
            id="senha-form"
            type="password"
            placeholder="Mínimo de 6 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
          />
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-3 pt-6 border-t border-slate-200">
        {cancelEdit && (
          <button 
            type="button" 
            onClick={cancelEdit} 
            className="group w-full sm:w-auto flex items-center justify-center gap-2 mt-2 sm:mt-0 bg-white text-slate-700 font-semibold px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
            Cancelar
          </button>
        )}
        <button 
          type="submit"
          className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500"
        >
          <CheckIcon className="h-5 w-5" />
          {usuarioEditando ? "Salvar Alterações" : "Criar Usuário"}
        </button>
      </div>
    </form>
  );
}
