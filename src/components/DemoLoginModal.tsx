import React, { useState } from 'react';
import { useWeatherApp, UserProfile } from '../context/WeatherAppContext';
import { supabase } from '../lib/supabase';
import { VayuLogo } from './VayuLogo';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

const ROLES = [
  { id: 'citizen', name: 'Citizen', initials: 'CT', department: 'Public Access' },
  { id: 'meteorologist', name: 'Meteorologist', initials: 'MT', department: 'Command Center' },
  { id: 'sdma', name: 'State Disaster Management', initials: 'SD', department: 'Emergency Ops' },
];

export const DemoLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useWeatherApp();
  
  const [selectedRoleId, setSelectedRoleId] = useState<string>('citizen');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [fullNameInput, setFullNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (authMode === 'register') {
        if (passwordInput !== confirmPasswordInput) {
          alert('Passwords do not match.');
          setIsSubmitting(false);
          return;
        }

        if (selectedRoleId !== 'citizen') {
          alert('Self-registration is only available for Citizen accounts. Please contact an administrator for Meteorologist or SDMA access.');
          setIsSubmitting(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput, password: passwordInput, name: fullNameInput || emailInput.split('@')[0], role: 'citizen' })
        });
        const data = await res.json();
        
        setIsSubmitting(false);
        if (!res.ok) {
          alert('Registration Error: ' + (data.error || 'Failed to register'));
        } else {
          alert('Registration successful! Please login with your new account.');
          setAuthMode('login');
          setPasswordInput('');
          setConfirmPasswordInput('');
        }
      } else {
        // Login
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailInput, password: passwordInput })
        });
        const data = await res.json();
        
        if (!res.ok || !data.user) {
          setIsSubmitting(false);
          alert('Login Error: ' + (data.error || 'Authentication failed. Please check your credentials.'));
          return;
        }

        const userRole = data.user.role || 'citizen';
        
        if (userRole !== selectedRoleId) {
          await fetch('/api/auth/logout', { method: 'POST' });
          setIsSubmitting(false);
          alert(`Unauthorized access: This account does not have ${ROLES.find(r => r.id === selectedRoleId)?.name} privileges.`);
          return;
        }

        const constructedUser: UserProfile = {
          email: data.user.email || '',
          name: data.user.name || data.user.email?.split('@')[0] || 'User',
          role: userRole,
          department: data.user.department || 'Registered User',
          initials: (data.user.name || data.user.email || 'U').substring(0, 2).toUpperCase(),
          region: data.user.region || 'Unknown',
          isAdmin: data.user.isAdmin || false
        };

        setIsSubmitting(false);
        login(constructedUser);
      }
    } catch (err) {
      setIsSubmitting(false);
      alert('Network error. Please try again.');
    }
  };

  const selectedRoleName = ROLES.find(r => r.id === selectedRoleId)?.name;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-fg/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
      <div className="w-full max-w-lg bg-surface border border-line rounded-2xl shadow-2xl shadow-fg/5 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-surface px-6 py-5 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VayuLogo size={32} />
            <div>
              <h3 className="text-sm font-black text-fg tracking-tight">
                VAYU AI Authentication
              </h3>
              <p className="text-[10px] text-accent font-bold tracking-widest uppercase">
                One Nation. One Sky. One Intelligence.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="text-fg-muted hover:text-status-severe hover:bg-status-severe/10 p-1.5 rounded-lg transition-colors"
            aria-label="Close login dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider">
              Select Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ROLES.map((role) => {
                const isSelected = selectedRoleId === role.id;
                return (
                  <button
                    type="button"
                    key={role.id}
                    onClick={() => handleSelectRole(role.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-primary-soft border-primary/20 shadow-md shadow-primary/20 ring-1 ring-primary/20'
                        : 'bg-app border-line hover:border-line'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${isSelected ? 'bg-primary text-white shadow-sm' : 'bg-surface text-primary border border-line'}`}>
                        {role.initials}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-fg text-xs leading-snug line-clamp-1">
                        {role.name}
                      </div>
                      <div className="text-[10px] font-medium text-fg-muted line-clamp-1 mt-0.5">
                        {role.department}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credentials Inputs */}
          <div className="space-y-4 pt-2 border-t border-line">
            
            {authMode === 'register' && (
              <div>
                <label className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    className="w-full bg-app border border-line rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-fg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider">
                  Official Identifier / Email
                </label>
                {authMode === 'login' && selectedRoleId !== 'citizen' && (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedRoleId === 'meteorologist') {
                        setEmailInput('swaminathan@vayu.gov.in');
                        setPasswordInput('demo-metops-2026');
                      } else if (selectedRoleId === 'sdma') {
                        setEmailInput('deshmukh@sdma.gov.in');
                        setPasswordInput('demo-metops-2026');
                      }
                    }}
                    className="text-[10px] font-bold text-primary hover:text-accent transition-colors"
                  >
                    Fill Demo Credentials
                  </button>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-app border border-line rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-fg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-app border border-line rounded-xl pl-10 pr-10 py-2.5 text-sm font-bold text-fg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                  required
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

            {authMode === 'register' && (
              <div>
                <label className="block text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-2">
                  Confirm Security Passcode
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPasswordInput}
                    onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    className="w-full bg-app border border-line rounded-xl pl-10 pr-10 py-2.5 text-sm font-bold text-fg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-col gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-soft text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{authMode === 'register' ? 'Registering...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {authMode === 'register' 
                      ? 'Create Citizen Account' 
                      : `Login as ${selectedRoleName}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex justify-between items-center text-xs font-bold text-fg-muted mt-2">
              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="hover:text-primary transition-colors underline underline-offset-4"
              >
                {authMode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
              </button>
              
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!emailInput) {
                      alert('Please enter your email to reset password.');
                      return;
                    }
                    alert('Password reset requested. Check your email to continue.');
                  }}
                  className="hover:text-primary transition-colors underline underline-offset-4"
                >
                  Reset Password
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
