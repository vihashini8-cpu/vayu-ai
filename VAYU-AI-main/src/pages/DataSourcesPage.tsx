import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { DataSource } from '../types';
import {
  Radio,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  X,
  Layers,
  Info,
} from 'lucide-react';

export const DataSourcesPage: React.FC = () => {
  const { dataSources, addToast } = useWeatherApp();
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualSync = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast({
        title: 'Streams Polled (Simulated Replay)',
        description: 'Successfully polled meteorological feeds. Data refreshed to latest simulation cycle.',
        type: 'info',
      });
    }, 600);
  };

  const getStatusBadge = (source: DataSource) => {
    if (source.type === 'citizen') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          Active In-App Intake
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-700/60">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        Simulated Feed (Demo Mode)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
            Data Sources & Ingestion Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Architecture for unified multi-modal meteorological ingestion from satellites, radar, ground sensors, and citizen reports
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1929] hover:bg-[#102238] border border-slate-700/80 text-xs font-semibold text-cyan-300 hover:text-white transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* Honest Prototype Disclosure Banner */}
      <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <strong className="text-white font-semibold">Data Stream Integrity Notice:</strong> For this Smart India Hackathon prototype demonstration, official meteorological streams (IMD, ISRO, DWR, SDMA) operate on realistic simulated datasets to demonstrate cross-validation workflows without requiring private government API keys. The Citizen Intake pipeline is actively wired to in-app state.
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0B1929] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Configured Source Feeds</div>
          <div className="text-2xl font-bold font-mono text-white">8 Sources</div>
          <div className="text-[11px] text-cyan-400 mt-1">Multi-modal topology</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1929] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Simulated AWS Coverage</div>
          <div className="text-2xl font-bold font-mono text-white">850+ Nodes</div>
          <div className="text-[11px] text-slate-400 mt-1">WMO Standard Sensors</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1929] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Target Ingestion Latency</div>
          <div className="text-2xl font-bold font-mono text-white">&lt; 300 ms</div>
          <div className="text-[11px] text-teal-400 mt-1">Sub-second design benchmark</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1929] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Protocol Compliance</div>
          <div className="text-2xl font-bold font-mono text-white">CAP & WMO</div>
          <div className="text-[11px] text-purple-400 mt-1">Standardized alert payloads</div>
        </div>
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dataSources.map((source) => (
          <div
            key={source.id}
            className="p-5 rounded-2xl bg-[#0B1929] border border-slate-800 hover:border-cyan-500/40 shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 group-hover:scale-105 transition-transform">
                  <Radio className="w-4 h-4" />
                </div>
                {getStatusBadge(source)}
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 leading-snug">
                {source.name}
              </h3>

              <div className="text-xs text-slate-400 mt-1 font-medium">
                {source.organization}
              </div>

              <p className="mt-2.5 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                {source.description}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Update Cadence:</span>
                  <span className="text-slate-300 font-mono text-[11px]">{source.updateFrequency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Target Latency:</span>
                  <span className="text-teal-400 font-mono text-[11px]">{source.latencyMs} ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Sample Records:</span>
                  <span className="text-white font-mono text-[11px] font-semibold">{source.reportsCount}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedSource(source)}
                className="w-full py-2 px-3 rounded-lg bg-[#102238] hover:bg-slate-700 text-xs text-cyan-300 hover:text-white font-semibold transition-colors text-center"
              >
                Inspect Protocol Specs →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Source Details Modal */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0B1929] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedSource.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedSource.organization}</p>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-[#102238] border border-slate-800">
                <span className="text-slate-500 block text-[11px] mb-1">Coverage Scope</span>
                <p className="text-slate-200">{selectedSource.coverage}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-[#102238] border border-slate-800">
                  <span className="text-slate-500 block text-[11px] mb-1">Transmission Protocol</span>
                  <p className="text-cyan-300 font-mono">{selectedSource.protocol}</p>
                </div>
                <div className="p-3 rounded-lg bg-[#102238] border border-slate-800">
                  <span className="text-slate-500 block text-[11px] mb-1">Update Cadence</span>
                  <p className="text-teal-300 font-mono">{selectedSource.updateFrequency}</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#07111F] border border-slate-800">
                <span className="text-slate-500 block text-[11px] mb-1 font-mono">Stream Endpoint Specification</span>
                <p className="text-slate-300 font-mono text-[11px] break-all">{selectedSource.endpointSample}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedSource(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
