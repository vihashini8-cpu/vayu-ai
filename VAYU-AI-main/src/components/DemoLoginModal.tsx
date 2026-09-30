import React, { useState } from 'react';
import { useWeatherApp, DEMO_USERS, UserProfile } from '../context/WeatherAppContext';
import { VayuLogo } from './VayuLogo';
import {
  X,
  Lock,
  Mail,
  ShieldCheck,
  UserCheck,
  Radio,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export const DemoLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, currentUser } = useWeatherApp();
  const [selectedUser, setSelectedUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [emailInput, setEmailInput] = useState(DEMO_USERS[0].email);
  const [passwordInput, setPasswordInput] = useState('demo-metops-2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSelectRole = (user: UserProfile) => {
    setSelectedUser(user);
    setEmailInput(user.email);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      login(selectedUser);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 transition-all">
      <div className="w-full max-w-lg bg-[#0B1929] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-[#07111F] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <VayuLogo size={28} />
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                VAYU AI Authentication
              </h3>
              <p className="text-[11px] text-cyan-400 font-mono">
                One Nation. One Sky. One Intelligence.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close login dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5">
          {/* Quick Demo Role Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Demo Role (1-Click Switch)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DEMO_USERS.map((user) => {
                const isSelected = selectedUser.email === user.email;
                return (
                  <button
                    type="button"
                    key={user.email}
                    onClick={() => handleSelectRole(user)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-950/40'
                        : 'bg-[#102238] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-6 h-6 rounded-md bg-cyan-600/30 text-cyan-300 flex items-center justify-center font-bold text-[10px]">
                        {user.initials}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs leading-snug line-clamp-1">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-cyan-300 font-medium line-clamp-1 mt-0.5">
                        {user.role}
                      </div>
                      <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5">
                        {user.department}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credentials Inputs */}
          <div className="space-y-3 pt-1 border-t border-slate-800/80">
            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">
                Official Identifier / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#102238] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1 font-semibold">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#102238] border border-slate-700 rounded-xl pl-9 pr-9 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>Simulated Single Sign-On (SSO) Active</span>
            </span>
            <span className="font-mono text-[10px] text-teal-300">DEMO VERIFIED</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Entering Command Center...</span>
                </>
              ) : (
                <>
                  <span>Enter Command Center as {selectedUser.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                login(DEMO_USERS[0]);
              }}
              className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Skip to Command Center (Default Guest Mode)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
