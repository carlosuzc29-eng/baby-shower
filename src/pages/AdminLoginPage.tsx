import React, { useState } from 'react';
import { useAuth, DEFAULT_ADMIN_PIN } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { DragonBall } from '../components/ui/DragonBall';
import { Lock, KeyRound, Mail, ArrowLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginPageProps {
  onSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onSuccess }) => {
  const { login, loginWithPin } = useAuth();
  const [authMode, setAuthMode] = useState<'pin' | 'email'>('pin');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      toast.error('Por favor escribe el PIN de acceso.');
      return;
    }

    const success = loginWithPin(pin);
    if (success) {
      toast.success('¡Bienvenido al Panel de los Papás! 💛');
      onSuccess();
    } else {
      toast.error('PIN incorrecto. (Prueba con el PIN predeterminado: 2026)');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      toast.success('¡Bienvenido al Panel de los Papás! 💛');
      onSuccess();
    } catch (err: any) {
      console.error(err);
      toast.error('Correo o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#F2F7FB] via-[#E8F2FA] to-[#DFEDF8] relative overflow-hidden">
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-white/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#F7931E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-[#D8E6F3] shadow-[0_16px_40px_-12px_rgba(28,45,66,0.15)] max-w-md w-full relative z-10 text-center">
        {/* Esfera del dragón y título */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-[#FFF6EC] to-[#FFE7CA] border border-[#F7931E]/40 flex items-center justify-center mx-auto mb-3 shadow-[0_4px_16px_rgba(247,147,30,0.22)]">
          <DragonBall stars={4} className="w-10 h-10 drop-shadow-[0_4px_10px_rgba(247,147,30,0.5)]" />
        </div>

        <h2 className="font-heading font-semibold text-2xl text-[#1C2D42] mb-1">
          Panel de los Papás
        </h2>
        <p className="text-xs sm:text-sm text-[#556E88] mb-5">
          Ingresa para ver los regalos recibidos y los mensajes de tus invitados.
        </p>

        {/* Pestañas de modo de acceso */}
        <div className="flex bg-[#EBF3FA] p-1 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setAuthMode('pin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'pin'
                ? 'bg-white text-[#1C2D42] shadow-xs'
                : 'text-[#556E88] hover:text-[#1C2D42]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-[#F7931E]" />
            <span>PIN de acceso rápido</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('email')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authMode === 'email'
                ? 'bg-white text-[#1C2D42] shadow-xs'
                : 'text-[#556E88] hover:text-[#1C2D42]'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#5880A4]" />
            <span>Correo</span>
          </button>
        </div>

        {authMode === 'pin' ? (
          <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
            <div>
              <label htmlFor="adminPin" className="block text-xs font-bold text-[#556E88] uppercase tracking-wider mb-2 text-center">
                Escribe tu PIN de los papás
              </label>
              <div className="relative max-w-xs mx-auto">
                <input
                  id="adminPin"
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  autoFocus
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 px-4 rounded-2xl border border-[#D8E6F3] bg-[#F8FBFE] text-[#1C2D42] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F7931E] transition-all"
                />
              </div>
              <p className="text-[11px] text-[#556E88] text-center mt-2 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>PIN inicial predeterminado: <strong>{DEFAULT_ADMIN_PIN}</strong></span>
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              className="mt-2 min-h-[46px] rounded-[16px] text-base font-bold shadow-md cursor-pointer"
            >
              Entrar al panel
            </Button>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-[#556E88] uppercase tracking-wider mb-1.5">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#556E88] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="papas@babyshower.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#D8E6F3] bg-[#F8FBFE] text-sm text-[#1C2D42] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F7931E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#556E88] uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#556E88] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#D8E6F3] bg-[#F8FBFE] text-sm text-[#1C2D42] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#F7931E]"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
              className="mt-2 min-h-[46px] rounded-[16px] text-base font-bold shadow-md cursor-pointer"
            >
              {isLoading ? 'Comprobando...' : 'Entrar con correo'}
            </Button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-[#D8E6F3] text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#556E88] hover:text-[#1C2D42] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la lista pública del Baby Shower</span>
          </a>
        </div>
      </div>
    </div>
  );
};
