import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { AUDIT_LOG } from '../data/mockData';
import {
  ShieldAlert,
  Radio,
  FileCheck2,
  RefreshCw,
  Users,
  Activity,
  Send,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
} from 'lucide-react';

export const AdminPanelPage: React.FC = () => {
  const {
    events,
    dataSources,
    verificationSummary,
    setIsEmergencyModalOpen,
    addToast,
    setSelectedEvent,
  } = useWeatherApp();

  const [activeTab, setActiveTab] = useState<'audit' | 'operators' | 'services'>('audit');

  const handleAction = (actionName: string) => {
    addToast({
      title: 'Administrative Routine Executed',
      description: `Routine: ${actionName} synchronized across national command cluster.`,
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
            National Meteorological Admin & Operations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Operational governance, Common Alerting Protocol dispatching, and security audit ledger
          </p>
        </div>

        <button
          onClick={() => setIsEmergencyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-lg shadow-rose-950/60"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Launch Emergency Advisory Dispatch</span>
        </button>
      </div>

      {/* Quick Action Operations Panel */}
      <div className="p-5 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Quick Meteorological Directives
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handleAction('Doppler Radar Network Synchronization')}
            className="p-3.5 rounded-xl bg-[#102238] hover:bg-slate-700/80 border border-slate-800 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-1">
              <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              <span>Sync All 37 Radar Grids</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Poll Paradip, Mumbai, and Kolkata DWR polarimetric sweeps.
            </p>
          </button>

          <button
            onClick={() => handleAction('Calibrate Automated AI Classifier Thresholds')}
            className="p-3.5 rounded-xl bg-[#102238] hover:bg-slate-700/80 border border-slate-800 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold mb-1">
              <FileCheck2 className="w-4 h-4" />
              <span>Calibrate AI Classifiers</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Tune confidence threshold to 92% for flash flood detection.
            </p>
          </button>

          <button
            onClick={() => handleAction('Purge Expired Hydromet Transient Telemetry')}
            className="p-3.5 rounded-xl bg-[#102238] hover:bg-slate-700/80 border border-slate-800 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
              <Zap className="w-4 h-4" />
              <span>Purge Expired Transient Data</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Flush intermediate Doppler buffers older than 72 hours.
            </p>
          </button>

          <button
            onClick={() => handleAction('Run Common Alerting Protocol Gateway Self-Test')}
            className="p-3.5 rounded-xl bg-[#102238] hover:bg-slate-700/80 border border-slate-800 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mb-1">
              <Server className="w-4 h-4" />
              <span>CAP Gateway Health Check</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Verify handshake with NDMA SACHET alert servers.
            </p>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'audit'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Cryptographic Audit Trail
        </button>
        <button
          onClick={() => setActiveTab('operators')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'operators'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Active Duty Meteorologists
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'services'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Core Microservice Status
        </button>
      </div>

      {/* Tab 1: Audit Log */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              National Immutable Audit Event Ledger
            </h3>
            <span className="text-[10px] font-mono text-slate-400">SHA-256 SIGNED</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {AUDIT_LOG.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#102238]/60 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-cyan-400 font-semibold">{log.id}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{log.timestamp}</span>
                    <span className="text-slate-600">·</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 text-teal-300 border border-slate-700 text-[10px]">
                      {log.action}
                    </span>
                  </div>
                  <p className="text-slate-200 font-medium">{log.details}</p>
                  <div className="text-[11px] text-slate-400">
                    Operator: <span className="text-slate-300">{log.performedBy}</span> · Target: <span className="font-mono text-cyan-400">{log.targetId}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      log.severity === 'alert'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : log.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                    }`}
                  >
                    {log.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Active Operators */}
      {activeTab === 'operators' && (
        <div className="p-5 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            Duty Operators & Field Liaisons
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#102238] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Dr. K. Swaminathan</span>
                <span className="w-2 h-2 rounded-full bg-teal-400" title="Active on shift" />
              </div>
              <div className="text-slate-400">Lead Cyclone Specialist · Eastern Division</div>
              <div className="text-[11px] font-mono text-cyan-300">Station: Paradip / Bhubaneswar</div>
            </div>

            <div className="p-4 rounded-xl bg-[#102238] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Ananya Deshmukh</span>
                <span className="w-2 h-2 rounded-full bg-teal-400" title="Active on shift" />
              </div>
              <div className="text-slate-400">Urban Hydrology Duty Officer</div>
              <div className="text-[11px] font-mono text-cyan-300">Station: Mumbai MCGM EOC</div>
            </div>

            <div className="p-4 rounded-xl bg-[#102238] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">Tsering Angchuk</span>
                <span className="w-2 h-2 rounded-full bg-teal-400" title="Active on shift" />
              </div>
              <div className="text-slate-400">Himalayan Western Disturbance Desk</div>
              <div className="text-[11px] font-mono text-cyan-300">Station: Shimla / Leh AWS Hub</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Microservice Cluster */}
      {activeTab === 'services' && (
        <div className="p-5 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Infrastructure Topology & Health
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#102238] border border-teal-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">Ingestion Daemon</span>
                <span className="text-[10px] font-mono text-teal-400">100% HEALTHY</span>
              </div>
              <div className="text-slate-400">Pulls WMO BUFR & MQTT streams</div>
            </div>

            <div className="p-4 rounded-xl bg-[#102238] border border-teal-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">AI Vision Classifier</span>
                <span className="text-[10px] font-mono text-teal-400">100% HEALTHY</span>
              </div>
              <div className="text-slate-400">TensorFlow / PyTorch worker pool</div>
            </div>

            <div className="p-4 rounded-xl bg-[#102238] border border-teal-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">Spatial Corroborator</span>
                <span className="text-[10px] font-mono text-teal-400">100% HEALTHY</span>
              </div>
              <div className="text-slate-400">PostGIS / GeoJSON bounding checks</div>
            </div>

            <div className="p-4 rounded-xl bg-[#102238] border border-teal-500/30">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">CAP Alert Broadcaster</span>
                <span className="text-[10px] font-mono text-teal-400">100% HEALTHY</span>
              </div>
              <div className="text-slate-400">SACHET & Cell Broadcast gateway</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
