import React, { useEffect, useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { Lock, EyeOff, Eye, CheckCircle2 } from 'lucide-react';
import { VayuLogo } from './VayuLogo';

export const SetupAccountModal: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsLoginModalOpen } = useWeatherApp();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (t) {
      setToken(t);
      // Remove token from URL for security
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (!token) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/setup-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        alert('Account setup complete! You can now log in.');
        setToken(null);
        setIsLoginModalOpen(true);
      } else {
        alert('Setup failed: ' + data.error);
      }
    } catch (err) {
      setIsSubmitting(false);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-app/80 backdrop-blur-md">
      <div className="bg-surface rounded-2xl border border-line shadow-2xl w-full max-w-[440px] p-6 space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <VayuLogo size={48} />
          </div>
          <h2 className="text-xl font-bold text-fg">Complete Official Registration</h2>
          <p className="text-sm text-fg-muted mt-2">
            Securely set your official account password to access the VAYU AI National Command Center.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2">
              New Security Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-app border border-line rounded-xl pl-10 pr-10 py-2.5 text-sm font-bold text-fg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-muted hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2">
              Confirm Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-app border border-line rounded-xl pl-10 pr-10 py-2.5 text-sm font-bold text-fg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                required
                minLength={8}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-primary hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Securing Account...' : 'Set Password & Activate'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
