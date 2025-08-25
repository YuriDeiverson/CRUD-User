import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowRightIcon } from '@heroicons/react/24/solid';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setError("");
  try {
    const { data } = await api.post("/usuarios/login", { email, senha });
    onLogin(data.token); // ⚡ atualiza estado no App
  } catch {
    setError("Credenciais inválidas. Verifique seu e-mail e senha.");
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Plataforma de Gestão
          </h1>
          <p className="text-slate-500 mt-3">
            Acesse para gerenciar seus usuários.
          </p>
        </div>
        
        <form 
          onSubmit={handleLogin} 
          className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Endereço de e-mail
              </label>
              <input 
                id="email"
                className="block w-full border border-slate-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                placeholder="seu@email.com" 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
              />
            </div>
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-slate-700 mb-1">
                Senha
              </label>
              <input 
                id="senha"
                className="block w-full border border-slate-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                placeholder="••••••••" 
                type="password" 
                value={senha} 
                onChange={e => setSenha(e.target.value)} 
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button 
            type="submit"
            className="group w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold px-4 py-3 rounded-lg hover:shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500"
          >
            Entrar
            <ArrowRightIcon className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Botão pequeno para registro */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="mt-2 w-full text-xs text-blue-600 hover:underline focus:outline-none"
          >
            Criar uma conta
          </button>
        </form>
      </div>
    </div>
  );
}
