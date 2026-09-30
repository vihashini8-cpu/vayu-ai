import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { VayuLogo } from './VayuLogo';
import {
  Menu,
  X,
  ArrowUpRight,
  Search,
  Sun,
  Moon,
  LogIn,
} from 'lucide-react';
import { ActiveView } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setIsSearchModalOpen,
    setIsLoginModalOpen,
    theme,
    toggleTheme,
    currentUser,
  } = useWeatherApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; view: ActiveView }[] = [
    { label: 'Command Center', view: 'command_center' },
    { label: 'Live Map', view: 'live_map' },
    { label: 'Events Feed', view: 'events' },
    { label: 'Data Sources', view: 'sources' },
    { label: 'Verification', view: 'verification' },
    { label: 'Analytics', view: 'analytics' },
  ];

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07111F]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 group text-left"
          >
            <VayuLogo size={34} />
            <div>
              <span className="font-display font-black text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                VAYU<span className="text-cyan-400 font-mono text-base font-normal ml-0.5">AI</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = activeView === link.view;
            return (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`text-sm font-medium transition-colors relative py-1 whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-[#0B1929] hover:bg-[#102238] border border-slate-700/80 text-slate-300 hover:text-cyan-300 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400" />
            )}
          </button>

          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#102238] hover:bg-slate-800 text-xs text-slate-400 hover:text-slate-200 border border-slate-700/80 transition-colors"
            title="Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Search India</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] text-slate-400 font-mono">⌘K</kbd>
          </button>

          {/* Demo Login Button */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-cyan-300 hover:text-white bg-[#0B1929] hover:bg-[#102238] border border-cyan-500/40 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5 text-cyan-400" />
            <span>Demo Login</span>
          </button>

          {/* Command Center CTA */}
          <button
            onClick={() => handleNavClick('command_center')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-lg shadow-md shadow-cyan-950/50 transition-all hover:scale-[1.02] whitespace-nowrap"
          >
            <span>Open Command Center</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/60"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/60"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/60"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07111F] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === link.view
                    ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsLoginModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 px-4 text-xs font-semibold text-cyan-300 bg-[#102238] border border-cyan-500/40 rounded-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Demo Login</span>
            </button>
            <button
              onClick={() => handleNavClick('command_center')}
              className="w-full text-center py-2.5 px-4 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg"
            >
              Launch Command Center
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
