import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { DataSource } from '../types';
import {
  Radio,
  RefreshCw,
  X,
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
        title: 'Streams Polled (Simulated)',
        description: 'Successfully polled feeds. Data refreshed.',
        type: 'info',
      });
    }, 600);
  };

  const getStatusBadge = (source: DataSource) => {
    if (source.type === 'citizen') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-status-normal/10 text-[10px] font-bold text-status-normal border border-status-normal/20 uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-status-normal" />
          Active Intake
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-fg-muted/10 text-[10px] font-bold text-fg-muted border border-line uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-fg-muted/50" />
        Simulated Feed
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-2xl font-bold text-fg tracking-tight">Data Sources & Ingestion</h2>
          <p className="text-sm text-fg-muted">
            Multi-modal meteorological ingestion from satellites, radar, ground sensors, and citizens.
          </p>
        </div>

        <button
          onClick={handleManualSync}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app border border-line hover:bg-fg-muted/5 text-sm font-bold text-fg transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* Notice Banner */}
      <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-sm text-fg flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-primary shrink-0" />
        <div className="leading-relaxed">
          <strong className="font-bold text-primary">Prototype Notice:</strong> For this demonstration, official meteorological streams operate on simulated datasets to demonstrate cross-validation workflows without requiring private APIs. The Citizen Intake pipeline is actively wired to in-app state.
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-line shadow-sm hover:border-accent/20 transition-colors">
          <div className="text-sm font-semibold text-fg-muted mb-1">Active Feeds</div>
          <div className="text-3xl font-bold text-fg">8</div>
          <div className="text-xs font-semibold text-fg-muted mt-2 uppercase tracking-wide">Multi-modal topology</div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-line shadow-sm hover:border-accent/20 transition-colors">
          <div className="text-sm font-semibold text-fg-muted mb-1">Simulated AWS Nodes</div>
          <div className="text-3xl font-bold text-fg">850+</div>
          <div className="text-xs font-semibold text-fg-muted mt-2 uppercase tracking-wide">WMO standard sensors</div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-line shadow-sm hover:border-accent/20 transition-colors">
          <div className="text-sm font-semibold text-fg-muted mb-1">Ingestion Latency</div>
          <div className="text-3xl font-bold text-fg">&lt; 300ms</div>
          <div className="text-xs font-semibold text-fg-muted mt-2 uppercase tracking-wide">Target benchmark</div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-line shadow-sm hover:border-accent/20 transition-colors">
          <div className="text-sm font-semibold text-fg-muted mb-1">Protocols</div>
          <div className="text-3xl font-bold text-fg">CAP</div>
          <div className="text-xs font-semibold text-fg-muted mt-2 uppercase tracking-wide">Standardized payloads</div>
        </div>
      </div>

      {/* Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dataSources.map((source) => (
          <div
            key={source.id}
            className="flex flex-col bg-surface border border-line rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
          >
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="p-2.5 rounded-xl bg-vayu-lavender/30 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Radio className="w-5 h-5" />
                </div>
                {getStatusBadge(source)}
              </div>

              <h3 className="text-base font-bold text-fg mb-1">
                {source.name}
              </h3>
              <div className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">
                {source.organization}
              </div>
              <p className="text-sm text-fg-muted line-clamp-3 leading-relaxed font-medium">
                {source.description}
              </p>

              <div className="mt-4 pt-4 border-t border-line space-y-2 text-sm text-fg-muted">
                <div className="flex justify-between">
                  <span className="font-semibold">Cadence:</span>
                  <span className="font-bold text-fg">{source.updateFrequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Latency:</span>
                  <span className="font-bold text-fg">{source.latencyMs}ms</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-app border-t border-line">
              <button
                onClick={() => setSelectedSource(source)}
                className="w-full py-2 text-sm font-bold text-primary hover:text-accent transition-colors"
              >
                View Protocol Specs
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 bg-fg/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface rounded-2xl shadow-xl overflow-hidden border border-line">
            <div className="flex items-center justify-between p-5 border-b border-line bg-app">
              <div>
                <h3 className="text-lg font-bold text-fg">{selectedSource.name}</h3>
                <p className="text-sm font-bold text-primary uppercase tracking-wider mt-1">{selectedSource.organization}</p>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className="p-2 text-fg-muted hover:text-status-severe rounded-full hover:bg-status-severe/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-4 rounded-xl bg-app border border-line">
                <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider block mb-1">Coverage</span>
                <p className="text-sm font-semibold text-fg">{selectedSource.coverage}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-app border border-line">
                  <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider block mb-1">Protocol</span>
                  <p className="text-sm font-bold text-primary font-mono">{selectedSource.protocol}</p>
                </div>
                <div className="p-4 rounded-xl bg-app border border-line">
                  <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider block mb-1">Cadence</span>
                  <p className="text-sm font-bold text-primary font-mono">{selectedSource.updateFrequency}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-fg text-fg-muted">
                <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider block mb-2">Endpoint Example</span>
                <p className="font-mono text-xs text-accent break-all font-medium">{selectedSource.endpointSample}</p>
              </div>
            </div>

            <div className="p-5 border-t border-line bg-app flex justify-end">
              <button
                onClick={() => setSelectedSource(null)}
                className="px-6 py-2.5 bg-surface border border-line hover:bg-fg-muted/5 text-fg text-sm font-bold rounded-xl transition-colors shadow-sm"
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

