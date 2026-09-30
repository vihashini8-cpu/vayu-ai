import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import {
  Search,
  Bell,
  Clock,
  ShieldAlert,
  RotateCcw,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  ChevronDown,
} from 'lucide-react';
import { ActiveView } from '../types';

export const CommandHeader: React.FC = () => {
  const {
    activeView,
    liveTime,
    setIsSearchModalOpen,
    setIsEmergencyModalOpen,
    setIsLoginModalOpen,
    verificationSummary,
    events,
    setSelectedEvent,
    resetDemoData,
    currentUser,
    logout,
    theme,
    toggleTheme,
  } = useWeatherApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const getBreadcrumbTitle = (view: ActiveView): string => {
    switch (view) {
      case 'command_center':
        return 'Command Center';
      case 'live_map':
        return 'Live Weather Map';
      case 'events':
        return 'Weather Events Ledger';
      case 'sources':
        return 'Data Sources & Feeds';
      case 'verification':
        return 'Verification Center';
      case 'citizen_report':
        return 'Report Weather Event';
      case 'analytics':
        return 'Analytics & Trends';
      case 'settings':
        return 'Settings & Architecture';
      default:
        return 'Command Center';
    }
  };

  const recentAlerts = events.filter((e) => e.severity === 'severe').slice(0, 3);

  return (
    <header className="h-16 bg-[#07111F]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Breadcrumbs & View Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <span className="text-cyan-400 font-bold">VAYU AI</span>
            <span className="text-slate-600">/</span>
            <span className="capitalize">{activeView.replace('_', ' ')}</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
            {getBreadcrumbTitle(activeView)}
          </h1>
        </div>
      </div>

      {/* Center: Search & Live Clock */}
      <div className="hidden md:flex items-center gap-3">
        {/* Search Bar Input */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#0B1929] hover:bg-[#102238] border border-slate-700/80 text-xs text-slate-400 hover:text-slate-200 transition-colors w-60 text-left shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">Search India weather events...</span>
          <kbd className="ml-auto px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Live IST Clock */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1929] border border-slate-800 text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span className="tabular-nums font-medium">{liveTime}</span>
        </div>
      </div>

      {/* Right: Actions, Theme Switcher, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-[#0B1929] hover:bg-[#102238] border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        {/* Reset Demo State Trigger */}
        <button
          onClick={resetDemoData}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0B1929] hover:bg-[#102238] border border-slate-800 text-slate-400 hover:text-white text-xs transition-colors"
          title="Reset demonstration data"
        >
          <RotateCcw className="w-3 h-3 text-cyan-400" />
          <span className="text-[11px]">Reset Data</span>
        </button>

        {/* Emergency Alert Broadcast Button */}
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
          title="Dispatch National Weather Advisory"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden xl:inline">Advisory Dispatch</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg bg-[#0B1929] hover:bg-[#102238] border border-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {verificationSummary.pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0B1929] border border-slate-700/80 rounded-xl shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 bg-[#07111F] border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Alerts ({recentAlerts.length})
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  NATIONAL GRID
                </span>
              </div>

              <div className="p-2 space-y-1.5 max-h-72 overflow-y-auto">
                {recentAlerts.map((alert) => (
                  <button
                    key={alert.id}
                    onClick={() => {
                      setSelectedEvent(alert);
                      setNotificationsOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-[#102238] transition-colors border border-transparent hover:border-slate-800 block"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-rose-400 font-semibold uppercase">{alert.category}</span>
                      <span className="text-slate-500 font-mono">{alert.reportedAgo}</span>
                    </div>
                    <div className="text-xs text-slate-200 font-medium truncate">
                      {alert.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {alert.location.city}, {alert.location.state}
                    </div>
                  </button>
                ))}

                <div className="pt-2 border-t border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400 py-1">
                    {verificationSummary.pendingCount} reports awaiting review
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Demo Authentication */}
        <div className="relative pl-1 border-l border-slate-800">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#0B1929] transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 p-[1px]">
              <div className="w-full h-full bg-[#0B1929] rounded-[7px] flex items-center justify-center text-cyan-300 font-bold text-xs">
                {currentUser.initials}
              </div>
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight truncate max-w-[130px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-teal-400 leading-tight truncate max-w-[130px]">
                {currentUser.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0B1929] border border-slate-700/80 rounded-xl shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 p-3 space-y-3">
              <div>
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">{currentUser.email}</div>
                <div className="text-[11px] text-cyan-400 font-medium mt-0.5">{currentUser.department}</div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-[#102238] transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>Switch Demo User</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out to Portal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
