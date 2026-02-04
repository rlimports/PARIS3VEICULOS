
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EiffelIcon } from '../components/Icons';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, user, loading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/admin/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Attempting login with:', email);
    const { error } = await signIn(email, password);
    console.log('Login result:', error ? error.message : 'success');

    if (error) {
      console.error('Login error details:', error);
      setError(`Erro: ${error.message || 'Credenciais inválidas. Tente novamente.'}`);
      setIsLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#89CFF0] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <EiffelIcon className="w-10 h-10 mx-auto mb-4 text-[#89CFF0]" />
          <h1 className="text-3xl font-extrabold text-white tracking-tighter mb-2">
            PARIS <span className="text-[#89CFF0]">3</span> <span className="text-zinc-600 font-medium text-xl">ADMIN</span>
          </h1>
          <p className="text-zinc-500 text-sm">Acesso restrito para administradores da loja.</p>
        </div>

        <form onSubmit={handleLogin} className="bg-zinc-900 border border-zinc-800 p-10 rounded-3xl shadow-2xl space-y-6">
          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 text-sm p-4 rounded-xl">{error}</div>}

          <div className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase mb-2 tracking-widest">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-zinc-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0] disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase mb-2 tracking-widest">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full bg-zinc-800 border-none rounded-xl p-4 text-white focus:ring-2 focus:ring-[#89CFF0] disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#89CFF0] text-zinc-950 font-black py-4 rounded-xl hover:bg-[#78BFDF] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-zinc-950 border-t-transparent mr-2"></div>
                ENTRANDO...
              </>
            ) : (
              'ENTRAR NO PAINEL'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
