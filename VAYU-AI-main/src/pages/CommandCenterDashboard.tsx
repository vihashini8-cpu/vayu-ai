import React from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { IndiaWeatherMap } from '../components/IndiaWeatherMap';
import {
  FileText,
  CheckCircle2,
  Clock,
  ShieldAlert,
  MapPin,
  ArrowRight,
  TrendingUp,
  FilePlus2,
  ShieldCheck,
} from 'lucide-react';
import { CATEGORY_DISTRIBUTION, REGIONAL_DISTRIBUTION_DATA } from '../data/mockData';

export const CommandCenterDashboard: React.FC = () => {
  const {
    events,
    verificationSummary,
    setSelectedEvent,
    setActiveView,
    setIsEmergencyModalOpen,
  } = useWeatherApp();

  const severeEvents = events.filter((e) => e.severity === 'severe');
  const recentEvents = events.slice(0, 5);

  const kpis = [
    {
      title: 'Active Weather Alerts',
      value: severeEvents.length,
      trend: 'Immediate Action Required',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      accentBorder: 'border-rose-500/30',
      textColor: 'text-rose-400',
      action: () => setActiveView('events'),
    },
    {
      title: 'Total Reported Events',
      value: (14820 + events.length).toLocaleString(),
      trend: 'National Sensor Grid',
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      accentBorder: 'border-blue-500/30',
      textColor: 'text-white',
      action: () => setActiveView('events'),
    },
    {
      title: 'Verified Events',
      value: (11240 + verificationSummary.verifiedCount).toLocaleString(),
      trend: `${verificationSummary.aiAccuracyEstimate} Precision Rate`,
      icon: <CheckCircle2 className="w-5 h-5 text-teal-400" />,
      accentBorder: 'border-teal-500/30',
      textColor: 'text-teal-400',
      action: () => setActiveView('events'),
    },
    {
      title: 'Awaiting Verification',
      value: verificationSummary.pendingCount,
      trend: `Avg review ${verificationSummary.averageVerificationTime}`,
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      accentBorder: 'border-amber-500/30',
      textColor: 'text-amber-400',
      action: () => setActiveView('verification'),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Subtitle & Tagline Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-slate-800/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
            National Weather Intelligence Command Center
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            One Nation. One Sky. One Intelligence. · Unified meteorological situational awareness across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('citizen_report')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shadow-sm"
          >
            <FilePlus2 className="w-3.5 h-3.5" />
            <span>Submit Citizen Report</span>
          </button>
        </div>
      </div>

      {/* 4 Focused KPI Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            onClick={kpi.action}
            className={`p-4 rounded-xl bg-[#0B1929] border ${kpi.accentBorder} shadow-sm hover:border-cyan-500/50 transition-all cursor-pointer hover:bg-[#102238]`}
          >
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-xs font-semibold text-slate-300 truncate pr-1">
                {kpi.title}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-900/60 shrink-0">
                {kpi.icon}
              </div>
            </div>

            <div className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight ${kpi.textColor}`}>
              {kpi.value}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">{kpi.trend}</span>
              <span className="text-[10px] text-cyan-400/80 font-mono">View →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Weather Alerts Callout */}
      {severeEvents.length > 0 && (
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase tracking-wider">
              <ShieldAlert className="w-3 h-3 animate-pulse" />
              {severeEvents.length} Severe Alerts Active
            </span>
            <span className="text-slate-200 font-medium truncate max-w-xl">
              {severeEvents[0].title} — <span className="text-slate-400">{severeEvents[0].location.city}, {severeEvents[0].location.state}</span>
            </span>
          </div>

          <button
            onClick={() => setSelectedEvent(severeEvents[0])}
            className="text-xs text-rose-300 hover:text-white font-semibold flex items-center gap-1 underline underline-offset-2"
          >
            <span>Inspect Threat Dossier</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Main Command Workspace: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive India Map & Regional Overview */}
        <div className="lg:col-span-8 space-y-4">
          {/* Map Card */}
          <div className="p-1 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  National Weather Situation Map
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time geospatial weather markers across India. Select any marker for full telemetry.
                </p>
              </div>

              <button
                onClick={() => setActiveView('live_map')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Full Map View</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <IndiaWeatherMap compact={true} onSelectEvent={(e) => setSelectedEvent(e)} />
          </div>

          {/* Regional Weather Overview Card */}
          <div className="p-4 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">Regional Weather Overview</h4>
                <p className="text-xs text-slate-400 mt-0.5">Incident distribution across high-activity Indian states</p>
              </div>
              <button
                onClick={() => setActiveView('analytics')}
                className="text-xs text-cyan-400 hover:text-cyan-300"
              >
                View Analytics →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {REGIONAL_DISTRIBUTION_DATA.slice(0, 4).map((reg) => (
                <div key={reg.state} className="p-3 rounded-xl bg-[#102238] border border-slate-800">
                  <div className="font-semibold text-white truncate">{reg.state}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{reg.label}</div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                    <span className="text-cyan-400">{reg.count} reports</span>
                    <span className="text-rose-400 font-semibold">{reg.severe} severe</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Weather Activity & Verification Queue */}
        <div className="lg:col-span-4 space-y-4">
          {/* Recent Weather Activity */}
          <div className="p-4 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Recent Weather Activity
              </h3>
              <button
                onClick={() => setActiveView('events')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                All Events ({events.length}) →
              </button>
            </div>

            <div className="space-y-2">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="p-3 rounded-xl bg-[#102238]/60 hover:bg-[#102238] border border-slate-800/80 hover:border-cyan-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-cyan-400 font-medium">{event.id}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        event.severity === 'severe'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {event.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-white line-clamp-1 leading-snug">
                    {event.title}
                  </h4>

                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      {event.location.city}, {event.location.state}
                    </span>
                    <span className="font-mono text-slate-500">{event.reportedAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Queue Snapshot */}
          <div className="p-4 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                Verification Status
              </h3>
              <button
                onClick={() => setActiveView('verification')}
                className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
              >
                Review ({verificationSummary.pendingCount}) →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#102238]">
                <span className="text-slate-300">Awaiting Desk Review</span>
                <span className="font-mono font-bold text-amber-400">{verificationSummary.pendingCount} reports</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#102238]">
                <span className="text-slate-300">Corroborated & Published</span>
                <span className="font-mono font-bold text-teal-400">{verificationSummary.verifiedCount} reports</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#102238]">
                <span className="text-slate-300">Discrepancy Flagged</span>
                <span className="font-mono font-bold text-rose-400">{verificationSummary.flaggedCount} reports</span>
              </div>
            </div>

            <button
              onClick={() => setActiveView('verification')}
              className="w-full py-2.5 px-3 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-300 font-semibold text-xs transition-colors text-center"
            >
              Open Verification Workspace ({verificationSummary.pendingCount})
            </button>
          </div>

          {/* Category Quick Breakdown */}
          <div className="p-4 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-lg space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Top Incident Categories
            </h4>
            <div className="space-y-1.5 text-xs">
              {CATEGORY_DISTRIBUTION.slice(0, 3).map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-slate-300 text-[11px]">
                    <span>{cat.label}</span>
                    <span className="font-mono text-cyan-400">{cat.count} ({cat.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cat.percentage * 2.5}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
