// frontend/src/pages/RegisterPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function RegisterPage() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nome || !email || !senha) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    try {
      await api.post("/usuarios/register", { nome, email, senha });
      setSuccess("Conta criada com sucesso! Redirecionando para login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Erro ao criar a conta. Tente novamente.");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Criar Conta
          </h1>
          <p className="text-slate-500 mt-3">
            Preencha os dados para criar sua conta.
          </p>
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="bg-white shadow-xl rounded-2xl p-8 space-y-6"
        >
          <div className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="block w-full border border-slate-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full border border-slate-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-slate-700 mb-1">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="block w-full border border-slate-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center font-medium">{success}</p>}

          <button
            type="submit"
            className="group w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold px-4 py-3 rounded-lg hover:shadow-lg hover:bg-blue-700 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500"
          >
            Criar Conta
            <ArrowRightIcon className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Botão discreto para voltar ao login */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-2 w-full text-xs text-blue-600 hover:underline focus:outline-none"
          >
            Já possui conta? Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
