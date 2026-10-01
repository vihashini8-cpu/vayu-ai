import React from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { IndiaWeatherMap } from '../components/IndiaWeatherMap';
import { FileText, CheckCircle2, Clock, ShieldAlert, MapPin, ArrowRight } from 'lucide-react';

export const CommandCenterDashboard: React.FC = () => {
  const { events, verificationSummary, setSelectedEvent, setActiveView } = useWeatherApp();
  
  const severeEvents = events.filter((e) => e.severity === 'severe');
  const recentEvents = events.slice(0, 5);

  const stats = [
    {
      title: 'Active Alerts',
      value: severeEvents.length,
      icon: <ShieldAlert className="w-5 h-5 text-status-severe" />,
      action: () => setActiveView('events'),
    },
    {
      title: 'Active Events',
      value: (14820 + events.length).toLocaleString(),
      icon: <FileText className="w-5 h-5 text-accent" />,
      action: () => setActiveView('events'),
    },
    {
      title: 'Verified',
      value: (11240 + verificationSummary.verifiedCount).toLocaleString(),
      icon: <CheckCircle2 className="w-5 h-5 text-status-normal" />,
      action: () => setActiveView('events'),
    },
    {
      title: 'Pending Review',
      value: verificationSummary.pendingCount,
      icon: <Clock className="w-5 h-5 text-status-warning" />,
      action: () => setActiveView('verification'),
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Distinctive feature panel for the main weather summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 md:p-8 rounded-2xl bg-hero text-on-hero shadow-md relative overflow-hidden">
        {/* Subtle atmospheric gradient effect behind the text */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-hero">National Weather Summary</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 text-on-hero uppercase tracking-wider border border-white/30">Demo Mode</span>
          </div>
          <p className="text-sm md:text-base text-on-hero/90 max-w-xl leading-relaxed">
            Real-time atmospheric intelligence and verified citizen reports across the Indian subcontinent.
          </p>
        </div>
        <button
          onClick={() => setActiveView('citizen_report')}
          className="relative z-10 px-5 py-2.5 rounded-xl bg-surface text-fg font-bold text-sm hover:bg-surface-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap"
        >
          Submit Report
        </button>
      </div>

      {/* 4 Compact Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            onClick={stat.action}
            className="p-5 rounded-xl bg-surface border border-line shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-fg-muted">{stat.title}</span>
              <div className="p-2 rounded-xl bg-app group-hover:bg-surface transition-colors border border-transparent group-hover:border-line">
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-fg tracking-tight">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout: Map & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Map */}
        <div className="lg:col-span-2 rounded-xl bg-surface border border-line shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-line flex items-center justify-between bg-surface">
            <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              National Map
            </h3>
            <button
              onClick={() => setActiveView('live_map')}
              className="text-xs font-semibold text-accent hover:text-accent/80 flex items-center gap-1 transition-colors"
            >
              Full Map <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 relative bg-app">
            <IndiaWeatherMap compact={true} onSelectEvent={(e) => setSelectedEvent(e)} />
          </div>
        </div>

        {/* Right: Recent Events */}
        <div className="lg:col-span-1 rounded-xl bg-surface border border-line shadow-sm flex flex-col h-full">
          <div className="p-4 border-b border-line bg-surface flex items-center justify-between">
            <h3 className="text-sm font-semibold text-fg flex items-center gap-2">
              <Clock className="w-4 h-4 text-status-normal" />
              Recent Events
            </h3>
            <button
              onClick={() => setActiveView('events')}
              className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-app">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="p-3.5 rounded-xl border border-line bg-surface hover:border-accent/20 hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2 gap-2">
                  <span className="text-xs font-semibold text-fg leading-tight group-hover:text-primary transition-colors">{event.title}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 tracking-wider ${
                      event.severity === 'severe'
                        ? 'bg-status-severe/10 text-status-severe border border-status-severe/20'
                        : 'bg-status-warning/10 text-status-warning border border-status-warning/20'
                    }`}
                  >
                    {event.severity}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-fg-muted font-medium">
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-fg-muted shrink-0" />
                    <span className="truncate">{event.location.city}, {event.location.state}</span>
                  </span>
                  <span className="shrink-0 ml-2 font-mono text-[10px] bg-app px-1.5 py-0.5 rounded text-fg-muted">{event.reportedAgo}</span>
                </div>
              </div>
            ))}
            {recentEvents.length === 0 && (
              <div className="text-center py-8 text-sm text-fg-muted">
                No recent events
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

