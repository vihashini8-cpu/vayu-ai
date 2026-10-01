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
    setPendingView,
    setIsSearchModalOpen,
    setIsLoginModalOpen,
    theme,
    toggleTheme,
    currentUser,
    isAuthenticated,
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
    if (view === 'landing' || isAuthenticated) {
      setActiveView(view);
    } else {
      setPendingView(view);
      setIsLoginModalOpen(true);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-surface backdrop-blur-md border-b border-line transition-all shadow-sm shadow-fg/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 group text-left"
          >
            <VayuLogo size={34} />
            <div>
              <span className="font-display font-black text-lg tracking-tight text-fg group-hover:text-primary transition-colors">
                VAYU<span className="text-accent font-mono text-base font-bold ml-0.5">AI</span>
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
                className={`text-sm font-bold transition-colors relative py-1 whitespace-nowrap ${
                  isActive
                    ? 'text-primary'
                    : 'text-fg-muted hover:text-fg'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary rounded-t-full" />
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
            className="p-2 rounded-lg bg-app hover:bg-fg-muted/10 border border-line text-fg-muted hover:text-primary transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-status-warning" />
            ) : (
              <Moon className="w-4 h-4 text-primary" />
            )}
          </button>

          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-app hover:bg-fg-muted/10 text-xs font-bold text-fg-muted hover:text-fg border border-line transition-colors"
            title="Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-accent" />
            <span>Search India</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface border border-line text-[10px] text-fg-muted font-mono shadow-sm">⌘K</kbd>
          </button>

          {/* Demo Login Button */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-primary hover:text-primary/80 bg-primary-soft hover:bg-primary-soft border border-primary/20 rounded-lg transition-colors whitespace-nowrap"
          >
            <LogIn className="w-4 h-4 text-primary" />
            <span>Demo Login</span>
          </button>

          {/* Command Center CTA */}
          <button
            onClick={() => handleNavClick('command_center')}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-soft rounded-lg shadow-md shadow-primary/20 transition-all hover:shadow-lg whitespace-nowrap"
          >
            <span>Open Command Center</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-fg-muted hover:text-fg rounded-lg bg-app"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-status-warning" /> : <Moon className="w-4 h-4 text-primary" />}
          </button>
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="p-2 text-fg-muted hover:text-fg rounded-lg bg-app"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-fg-muted hover:text-fg rounded-lg bg-app"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-line px-4 pt-3 pb-6 space-y-4 shadow-lg shadow-fg/5">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                  activeView === link.view
                    ? 'bg-primary-soft text-primary'
                    : 'text-fg-muted hover:bg-fg-muted/5 hover:text-fg'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-line flex flex-col gap-3">
            <button
              onClick={() => {
                setIsLoginModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-3 px-4 text-sm font-bold text-primary bg-primary-soft border border-primary/20 rounded-xl flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Demo Login</span>
            </button>
            <button
              onClick={() => handleNavClick('command_center')}
              className="w-full text-center py-3 px-4 text-sm font-bold text-white bg-primary rounded-xl shadow-md shadow-primary/20"
            >
              Launch Command Center
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
