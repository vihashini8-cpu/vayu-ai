import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { VayuLogo } from './VayuLogo';
import {
  LayoutDashboard,
  Map,
  CloudSunRain,
  Radio,
  ShieldCheck,
  BarChart3,
  FilePlus2,
  Settings,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { ActiveView } from '../types';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, verificationSummary, resetDemoData, currentUser } = useWeatherApp();
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems: {
    id: ActiveView | 'admin';
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'command_center',
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'live_map',
      label: 'Live Map',
      icon: <Map className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'events',
      label: 'Events',
      icon: <CloudSunRain className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'verification',
      label: 'Verification',
      icon: <ShieldCheck className="w-4 h-4 shrink-0" />,
      badge: verificationSummary.pendingCount,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
    ...(currentUser.isAdmin ? [{
      id: 'admin' as ActiveView | 'admin',
      label: 'Admin Panel',
      icon: <Settings className="w-4 h-4 shrink-0" />,
    }] : [])
  ];

  return (
    <>
    <aside
      className={`relative z-30 hidden md:flex flex-col bg-sidebar border-r border-line border-r border-primary transition-all duration-300 ease-in-out shrink-0 select-none ${
        collapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Brand Logo & Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-primary">
        <button
          onClick={() => setActiveView('command_center')}
          className="flex items-center gap-2.5 text-left group min-w-0"
          title="VAYU AI Command Center"
        >
          <VayuLogo size={32} />
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-display font-black text-base tracking-tight text-white group-hover:text-accent transition-colors block truncate">
                VAYU<span className="text-accent font-mono text-xs ml-1">AI</span>
              </span>
              <span className="text-[10px] text-fg-muted block truncate font-medium">
                Weather Intelligence
              </span>
            </div>
          )}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 text-fg-muted hover:text-white rounded-lg hover:bg-primary transition-colors ml-1"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {mainNavItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-primary text-white border border-accent/20 shadow-sm'
                  : 'text-fg-muted hover:text-white hover:bg-primary-soft border border-transparent'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <div
                className={`transition-colors ${
                  isActive ? 'text-accent' : 'text-fg-muted group-hover:text-accent/80'
                }`}
              >
                {item.icon}
              </div>

              {!collapsed && (
                <span className="truncate flex-1 text-left font-medium tracking-tight">
                  {item.label}
                </span>
              )}

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                    collapsed
                      ? 'absolute top-1.5 right-1.5 w-2 h-2 p-0 bg-status-warning'
                      : 'bg-status-warning/10 border border-status-warning/20 text-status-warning'
                  }`}
                >
                  {!collapsed && item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reset Demo Data & Status Card */}
      <div className="p-3 border-t border-primary space-y-2">
        <button
          onClick={resetDemoData}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-fg-muted hover:text-white bg-transparent hover:bg-primary border border-primary transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Reset demonstration data to initial state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-accent shrink-0" />
          {!collapsed && <span>Reset Demo Data</span>}
        </button>

      </div>
    </aside>
    
    {/* Mobile Bottom Navigation */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-header backdrop-blur-md border-t border-line border-primary z-50 flex items-center justify-around h-16 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      {mainNavItems.slice(0, 5).map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              isActive ? 'text-primary' : 'text-fg-muted hover:text-fg'
            }`}
          >
            <div className={`p-1.5 rounded-full ${isActive ? 'bg-primary-soft' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
    </>
  );
};

