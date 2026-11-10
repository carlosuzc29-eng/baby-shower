import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Heart, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginPageProps {
  onSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('¡Bienvenido papito/mamita! 💛');
      onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error('Correo o contraseña incorrectos. Revisa tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-theme-bg">
      <div className="bg-white p-8 rounded-3xl border border-theme shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-theme-accent-light text-theme-accent flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Heart className="w-8 h-8 fill-current" />
        </div>

        <h2 className="font-serif font-bold text-2xl sm:text-3xl text-theme mb-2">
          Panel de los papás
        </h2>
        <p className="text-xs sm:text-sm text-theme-muted mb-6 leading-relaxed">
          Ingresa con el correo y la contraseña de administrador para gestionar la lista de regalos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="papas@babyshower.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-theme uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-theme-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-theme bg-theme-bg/40 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-theme-accent"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
              {isLoading ? 'Iniciando sesión...' : 'Entrar al panel'}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-theme/60 text-center">
          <a
            href="/"
            className="text-xs font-bold text-theme-muted hover:text-theme transition-colors"
          >
            ← Volver a la lista del Baby Shower
          </a>
        </div>
      </div>
    </div>
  );
};
