import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Key, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import BrandLogo from '../../components/common/BrandLogo';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@sonicvault.com');
  const [password, setPassword] = useState('SonicVault2026!');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      // Store session token securely
      localStorage.setItem('sv_admin_token', data.token);
      localStorage.setItem('sv_admin_user', JSON.stringify(data.user));

      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrative credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040609] text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-[#4E85BF] selection:text-white">
      <div className="w-full max-w-md bg-[#080c14] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-3">
          <BrandLogo variant="stacked" size="lg" showTagline={false} />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#89AACC] text-[10px] font-mono tracking-widest uppercase">
            <Lock className="w-3 h-3 text-[#4E85BF]" />
            <span>CONFIDENTIAL CONSOLE ACCESS</span>
          </div>
          <p className="text-xs text-slate-400">
            Authorized studio administration & session management
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 block">ADMINISTRATOR EMAIL</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sonicvault.com"
                className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#4E85BF] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono text-slate-400 block">PASSWORD</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/50 border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#4E85BF] transition-colors"
              />
            </div>
          </div>

          {/* Quick Demo Helper Chip */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#89AACC]" />
              <span>Provisioned Demo Credentials</span>
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              admin@sonicvault.com · SonicVault2026!
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl accent-gradient text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? 'AUTHENTICATING...' : 'SIGN IN TO DASHBOARD'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
