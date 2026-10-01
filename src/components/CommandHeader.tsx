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
    <header className="h-16 bg-header backdrop-blur-md border-b border-line/90 backdrop-blur-md border-b border-primary px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: View Title */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-fg-muted font-medium">
            <span className="capitalize">{activeView.replace('_', ' ')}</span>
          </div>
          <h1 className="text-sm sm:text-base lg:text-lg font-bold text-fg whitespace-nowrap">
            {getBreadcrumbTitle(activeView)}
          </h1>
        </div>
      </div>

      {/* Center: Search & Live Clock */}
      <div className="hidden md:flex items-center gap-3">
        {/* Search Bar Input */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-primary-soft hover:bg-primary-soft border border-primary text-xs text-fg-muted hover:text-white transition-colors w-60 text-left shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="truncate">Search India weather events...</span>
          <kbd className="ml-auto px-1.5 py-0.5 rounded bg-header backdrop-blur-md border-b border-line border border-primary text-[10px] text-fg-muted font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Live IST Clock */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-soft border border-primary text-xs font-mono text-white">
          <Clock className="w-3.5 h-3.5 text-accent" />
          <span className="tabular-nums font-medium">{liveTime}</span>
        </div>
      </div>

      {/* Right: Actions, Theme Switcher, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Theme Toggle (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-primary-soft hover:bg-primary-soft border border-primary text-fg-muted hover:text-accent transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-status-warning" />
          ) : (
            <Moon className="w-4 h-4 text-accent" />
          )}
        </button>

        {/* Reset Demo State Trigger */}
        <button
          onClick={resetDemoData}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary-soft hover:bg-primary-soft border border-primary text-fg-muted hover:text-white text-xs transition-colors"
          title="Reset demonstration data"
        >
          <RotateCcw className="w-3 h-3 text-accent" />
          <span className="text-[11px]">Reset Data</span>
        </button>

        {/* Emergency Alert Broadcast Button */}
        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-status-severe/10 hover:bg-status-severe/10 text-status-severe border border-status-severe/20 text-xs font-semibold transition-colors"
          title="Dispatch National Weather Advisory"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-status-severe" />
          <span className="hidden xl:inline">Advisory Dispatch</span>
        </button>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg bg-primary-soft hover:bg-primary-soft border border-primary text-fg-muted hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {verificationSummary.pendingCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-warning rounded-full animate-ping" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-header backdrop-blur-md border-b border-line border border-primary rounded-xl shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 bg-primary-soft border-b border-primary flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Alerts ({recentAlerts.length})
                </span>
                <span className="text-[10px] font-mono text-accent">
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
                    className="w-full text-left p-2.5 rounded-lg hover:bg-primary-soft transition-colors border border-transparent hover:border-primary block"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-status-severe font-semibold uppercase">{alert.category}</span>
                      <span className="text-fg-muted font-mono">{alert.reportedAgo}</span>
                    </div>
                    <div className="text-xs text-white font-medium truncate">
                      {alert.title}
                    </div>
                    <div className="text-[11px] text-fg-muted mt-0.5">
                      {alert.location.city}, {alert.location.state}
                    </div>
                  </button>
                ))}

                <div className="pt-2 border-t border-primary text-center">
                  <div className="text-[11px] text-fg-muted py-1">
                    {verificationSummary.pendingCount} reports awaiting review
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Demo Authentication */}
        <div className="relative pl-1 border-l border-primary">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-primary-soft transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-primary p-[1px]">
              <div className="w-full h-full bg-header backdrop-blur-md border-b border-line rounded-[7px] flex items-center justify-center text-accent font-bold text-xs">
                {currentUser.initials}
              </div>
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-white leading-tight truncate max-w-[130px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-status-normal leading-tight truncate max-w-[130px]">
                {currentUser.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-fg-muted hidden xl:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-header backdrop-blur-md border-b border-line border border-primary rounded-xl shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 p-3 space-y-3">
              <div>
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[11px] text-fg-muted font-mono">{currentUser.email}</div>
                <div className="text-[11px] text-accent font-medium mt-0.5">{currentUser.department}</div>
              </div>

              <div className="pt-2 border-t border-primary space-y-1.5">
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-white hover:bg-primary transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-accent" />
                  <span>Switch Demo User</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-status-severe hover:bg-status-severe/10 transition-colors"
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
