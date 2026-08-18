import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Loader2, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login({ email: email.trim(), password });
      navigate('/admin');
    } catch (err) {
      setError((err as Error).message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-unb-navy flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-xs shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div
            className="w-12 h-12 bg-unb-amber mx-auto flex items-center justify-center font-bold text-white text-xl shadow-sm"
            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          >
            <span className="mt-2 text-xs text-unb-navy font-black">UNB</span>
          </div>
          <h1 className="text-2xl font-black text-unb-navy tracking-tight">UNB ADMIN PORTAL</h1>
          <p className="text-xs text-gray-500 font-medium">Sign in to manage products, news & careers</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xs flex items-center gap-2 text-xs text-red-700 font-medium">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {user ? (
          <div className="py-4 space-y-4 text-center border-t border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-unb-navy">Signed in as {user.name}</h3>
              <p className="text-xs text-gray-500">
                {user.email} ({user.role})
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Button onClick={() => navigate('/admin')} variant="primary" className="w-full justify-center">
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                <span>OPEN ADMIN CMS</span>
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm" className="w-full justify-center">
                LOG OUT
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@unb.co.za"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xs focus:outline-hidden focus:border-unb-navy"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="navy" className="w-full justify-center" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    SIGNING IN...
                  </span>
                ) : (
                  'SIGN IN TO PORTAL'
                )}
              </Button>
            </div>
          </form>
        )}

        <div className="text-center pt-2">
          <Link to="/" className="text-xs font-bold text-unb-navy hover:text-unb-amber">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
};
