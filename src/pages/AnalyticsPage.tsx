import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import {
  CATEGORY_DISTRIBUTION,
  REGIONAL_DISTRIBUTION_DATA,
  TIME_SERIES_DATA_7D,
} from '../data/mockData';
import {
  TrendingUp,
  Download,
  PieChart,
  ShieldCheck,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { addToast } = useWeatherApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  const handleExportData = () => {
    addToast({
      title: 'Report Generated',
      description: 'Analytics data exported successfully.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-2xl font-bold text-fg tracking-tight">Analytics & Trends</h2>
          <p className="text-sm text-fg-muted">System metrics and intelligence overview.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-vayu-lavender/30 text-sm border border-vayu-lavender/20">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-colors ${
                timeRange === '7d' ? 'bg-fg text-white shadow-sm' : 'text-fg-muted hover:bg-vayu-lavender/20'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-1.5 rounded-lg font-semibold transition-colors ${
                timeRange === '30d' ? 'bg-fg text-white shadow-sm' : 'text-fg-muted hover:bg-vayu-lavender/20'
              }`}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app border border-line hover:bg-fg-muted/5 text-sm font-bold text-fg transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-line shadow-sm hover:border-accent/20 transition-colors">
          <div className="text-sm font-semibold text-fg-muted mb-1">Total Reports</div>
          <div className="text-3xl font-bold text-fg">14,829</div>
          <div className="text-xs text-status-normal mt-2 flex items-center gap-1 font-bold tracking-wide">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% TREND
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-line shadow-sm hover:border-accent/20 transition-colors">
          <div className="text-sm font-semibold text-fg-muted mb-1">Accuracy</div>
          <div className="text-3xl font-bold text-fg">96.8%</div>
          <div className="text-xs font-semibold text-fg-muted mt-2 uppercase tracking-wide">Sensor agreement</div>
        </div>

        <div className="p-5 rounded-2xl bg-surface border border-line shadow-sm hover:border-accent/20 transition-colors">
          <div className="text-sm font-semibold text-fg-muted mb-1">Avg. Turnaround</div>
          <div className="text-3xl font-bold text-fg">4.2m</div>
          <div className="text-xs font-semibold text-fg-muted mt-2 uppercase tracking-wide">Review to publish</div>
        </div>

        <div className="p-5 rounded-2xl bg-status-severe/10 border border-status-severe/20 shadow-sm hover:border-status-severe/20 transition-colors">
          <div className="text-sm font-semibold text-status-severe mb-1">Severe Incidents</div>
          <div className="text-3xl font-bold text-status-severe">148</div>
          <div className="text-xs font-bold text-status-severe/80 mt-2 uppercase tracking-wide">Red alert level</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports Over Time Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <div>
              <h3 className="text-base font-bold text-fg flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Incident Volume
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-fg-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                Total Reports
              </span>
              <span className="flex items-center gap-1.5 text-fg-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-status-normal" />
                Verified
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <svg viewBox="0 0 700 220" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#43D9E6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#43D9E6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="50" y1="30" x2="680" y2="30" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="80" x2="680" y2="80" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="130" x2="680" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="50" y1="180" x2="680" y2="180" stroke="#e2e8f0" strokeWidth="1" />

              <text x="35" y="35" fill="#64748b" fontSize="10" textAnchor="end" fontWeight="600">2000</text>
              <text x="35" y="85" fill="#64748b" fontSize="10" textAnchor="end" fontWeight="600">1500</text>
              <text x="35" y="135" fill="#64748b" fontSize="10" textAnchor="end" fontWeight="600">1000</text>
              <text x="35" y="185" fill="#64748b" fontSize="10" textAnchor="end" fontWeight="600">500</text>

              <polygon
                points="60,120 160,110 260,95 360,98 460,78 560,62 660,45 660,180 60,180"
                fill="url(#totalGradient)"
              />
              <polyline
                points="60,120 160,110 260,95 360,98 460,78 560,62 660,45"
                fill="none" stroke="#283B72" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              />
              <polyline
                points="60,135 160,125 260,112 360,118 460,96 560,82 660,66"
                fill="none" stroke="#18B8A6" strokeWidth="2.5" strokeDasharray="6 6" strokeLinecap="round" strokeLinejoin="round"
              />

              {TIME_SERIES_DATA_7D.map((item, idx) => {
                const x = 60 + idx * 100;
                return (
                  <g key={item.day}>
                    <circle cx={x} cy={180 - (item.total / 2000) * 150} r="4" fill="#43D9E6" stroke="#283B72" strokeWidth="2.5" />
                    <text x={x} y="205" fill="#64748b" fontSize="10" textAnchor="middle" fontWeight="bold" className="uppercase tracking-wider">{item.day}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <h3 className="text-base font-bold text-fg flex items-center gap-2">
              <PieChart className="w-4 h-4 text-primary" />
              By Category
            </h3>
          </div>

          <div className="space-y-4 pt-2">
            {CATEGORY_DISTRIBUTION.map((item, i) => {
              // Override generic colors with VAYU palette
              const colors = ['#283B72', '#43D9E6', '#18B8A6', '#E9A23B', '#E56B6F', '#64748B'];
              const color = colors[i % colors.length];

              return (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-fg">{item.label}</span>
                    <span className="text-fg-muted font-medium text-xs">
                      <span className="font-bold text-fg text-sm mr-1">{item.count}</span> ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-fg-muted/10 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage * 2.8}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regional Distribution */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <h3 className="text-base font-bold text-fg">Regional Density</h3>
          </div>

          <div className="space-y-4 pt-2">
            {REGIONAL_DISTRIBUTION_DATA.slice(0, 5).map((reg) => (
              <div key={reg.state} className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-3 text-sm font-semibold text-fg truncate">
                  {reg.state}
                </div>
                <div className="col-span-7">
                  <div className="w-full bg-fg-muted/10 h-3.5 rounded-full overflow-hidden flex">
                    <div className="bg-primary h-full" style={{ width: `${(reg.count / 200) * 100}%` }} />
                    <div className="bg-status-severe h-full" style={{ width: `${(reg.severe / 200) * 100}%` }} title={`${reg.severe} severe`} />
                  </div>
                </div>
                <div className="col-span-2 text-right text-sm font-bold text-fg">
                  {reg.count} <span className="text-[11px] font-bold text-status-severe ml-1 bg-status-severe/10 px-1.5 py-0.5 rounded">({reg.severe})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Performance Metrics */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-surface border border-line shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <h3 className="text-base font-bold text-fg flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-status-normal" />
              Quality Benchmarks
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-app border border-line">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-fg-muted">AI Pre-classification</span>
                <span className="font-bold text-status-normal">98.2%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-app border border-line">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-fg-muted">False Report Prevention</span>
                <span className="font-bold text-accent">99.4%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-app border border-line">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-fg-muted">Sensor Sync Accuracy</span>
                <span className="font-bold text-primary">94.1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

