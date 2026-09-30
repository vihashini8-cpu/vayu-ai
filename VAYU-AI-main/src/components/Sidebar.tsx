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
  const { activeView, setActiveView, verificationSummary, resetDemoData } = useWeatherApp();
  const [collapsed, setCollapsed] = useState(false);

  const mainNavItems: {
    id: ActiveView;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'command_center',
      label: 'Command Center',
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
      id: 'sources',
      label: 'Sources',
      icon: <Radio className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'verification',
      label: 'Verification',
      icon: <ShieldCheck className="w-4 h-4 shrink-0" />,
      badge: verificationSummary.pendingCount,
    },
    {
      id: 'citizen_report',
      label: 'Report Event',
      icon: <FilePlus2 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside
      className={`relative z-30 flex flex-col bg-[#07111F] border-r border-slate-800/90 transition-all duration-300 ease-in-out shrink-0 select-none ${
        collapsed ? 'w-20' : 'w-60'
      }`}
    >
      {/* Brand Logo & Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
        <button
          onClick={() => setActiveView('command_center')}
          className="flex items-center gap-2.5 text-left group min-w-0"
          title="VAYU AI Command Center"
        >
          <VayuLogo size={32} />
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-display font-black text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors block truncate">
                VAYU<span className="text-cyan-400 font-mono text-xs ml-1">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 block truncate font-medium">
                Weather Intelligence
              </span>
            </div>
          )}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors ml-1"
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
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#102238]/60 border border-transparent'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <div
                className={`transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
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
                      ? 'absolute top-1.5 right-1.5 w-2 h-2 p-0 bg-amber-400'
                      : 'bg-amber-500/20 border border-amber-500/30 text-amber-300'
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
      <div className="p-3 border-t border-slate-800/80 space-y-2">
        <button
          onClick={resetDemoData}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#0B1929] hover:bg-[#102238] border border-slate-800 transition-colors ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Reset demonstration data to initial state"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          {!collapsed && <span>Reset Demo Data</span>}
        </button>

        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-[#0B1929]/80 border border-slate-800/90 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                System Active · Online
              </span>
              <span className="text-[10px] font-mono text-cyan-400">OPERATIONAL</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              One Nation. One Sky. One Intelligence.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
