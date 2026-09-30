import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import {
  CATEGORY_DISTRIBUTION,
  REGIONAL_DISTRIBUTION_DATA,
  TIME_SERIES_DATA_7D,
} from '../data/mockData';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Layers,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { events, addToast } = useWeatherApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');

  const handleExportData = () => {
    addToast({
      title: 'Meteorological Analytics Dossier Generated',
      description: 'National weather incident records exported as GeoJSON & CSV bundle.',
      type: 'success',
    });
  };

  const totalReportsCount = 14829;
  const verifiedPercentage = 96.8;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
              VAYU AI Intelligence & Trend Analytics
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#102238] border border-slate-700 text-slate-400">
              SIMULATED BENCHMARKS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Spatio-temporal incident trends, category breakdowns, and cross-verification benchmarks
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center p-1 rounded-xl bg-[#0B1929] border border-slate-800 text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                timeRange === '7d'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                timeRange === '30d'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                timeRange === '90d'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Seasonal Quarter
            </button>
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B1929] hover:bg-[#102238] border border-slate-700 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Metrics</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0B1929] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Total Reports Processed</div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">14,829</div>
          <div className="text-[11px] text-teal-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% trajectory</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1929] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Corroboration Accuracy</div>
          <div className="text-2xl font-bold font-mono text-teal-400 tabular-nums">96.8%</div>
          <div className="text-[11px] text-slate-400 mt-1">AWS & Radar agreement</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1929] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">Mean Review Turnaround</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">4.2 min</div>
          <div className="text-[11px] text-slate-400 mt-1">From intake to publish</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0B1929] border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">High Severity Incidents</div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">148</div>
          <div className="text-[11px] text-rose-400/80 mt-1">Red alert tier</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports Over Time (Line Chart SVG) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Ingestion Volume Trajectory Over Time
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Daily total reports vs confirmed verified observations across national sensors
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                Total Ingested
              </span>
              <span className="flex items-center gap-1.5 text-teal-300">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
                Verified
              </span>
            </div>
          </div>

          {/* Clean High-Resolution SVG Line Chart */}
          <div className="h-64 w-full pt-2">
            <svg viewBox="0 0 700 220" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              <line x1="50" y1="30" x2="680" y2="30" stroke="#16273B" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="80" x2="680" y2="80" stroke="#16273B" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="130" x2="680" y2="130" stroke="#16273B" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="180" x2="680" y2="180" stroke="#16273B" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="35" y="35" fill="#64748B" fontSize="10" textAnchor="end" fontFamily="monospace">2000</text>
              <text x="35" y="85" fill="#64748B" fontSize="10" textAnchor="end" fontFamily="monospace">1500</text>
              <text x="35" y="135" fill="#64748B" fontSize="10" textAnchor="end" fontFamily="monospace">1000</text>
              <text x="35" y="185" fill="#64748B" fontSize="10" textAnchor="end" fontFamily="monospace">500</text>

              {/* Area fill for Total */}
              <polygon
                points="
                  60,120
                  160,110
                  260,95
                  360,98
                  460,78
                  560,62
                  660,45
                  660,180
                  60,180
                "
                fill="url(#totalGradient)"
              />

              {/* Total Ingested Line */}
              <polyline
                points="
                  60,120
                  160,110
                  260,95
                  360,98
                  460,78
                  560,62
                  660,45
                "
                fill="none"
                stroke="#22D3EE"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Verified Line */}
              <polyline
                points="
                  60,135
                  160,125
                  260,112
                  360,118
                  460,96
                  560,82
                  660,66
                "
                fill="none"
                stroke="#2DD4BF"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points & X Labels */}
              {TIME_SERIES_DATA_7D.map((item, idx) => {
                const x = 60 + idx * 100;
                return (
                  <g key={item.day}>
                    <circle cx={x} cy={180 - (item.total / 2000) * 150} r="4" fill="#22D3EE" stroke="#0B1929" strokeWidth="2" />
                    <text x={x} y="202" fill="#94A3B8" fontSize="11" textAnchor="middle">
                      {item.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Category Breakdown (Donut Style Metric) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Incidents by Weather Category
            </h3>
            <span className="text-[10px] font-mono text-cyan-400">24H CYCLE</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {CATEGORY_DISTRIBUTION.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-mono text-slate-400">
                    <strong className="text-white">{item.count}</strong> ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage * 2.8}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Distribution Horizontal Bar Chart */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Top 10 Indian States by Incident Density</h3>
              <p className="text-xs text-slate-400 mt-0.5">Disaster vulnerability and volume distribution</p>
            </div>
            <span className="text-[10px] font-mono text-slate-400">STATE EOC SYNC</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {REGIONAL_DISTRIBUTION_DATA.map((reg) => (
              <div key={reg.state} className="grid grid-cols-12 items-center gap-3">
                <div className="col-span-3 text-slate-200 font-semibold truncate">
                  {reg.state}
                </div>
                <div className="col-span-7">
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-cyan-500 h-full"
                      style={{ width: `${(reg.count / 200) * 100}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full"
                      style={{ width: `${(reg.severe / 200) * 100}%` }}
                      title={`${reg.severe} severe threats`}
                    />
                  </div>
                </div>
                <div className="col-span-2 text-right font-mono text-slate-300 tabular-nums">
                  {reg.count} <span className="text-[10px] text-rose-400">({reg.severe})</span>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Bar key: Blue = Total Reports, Red = Severe Advisories</span>
            <span>Refreshed hourly</span>
          </div>
        </div>

        {/* Verification Performance Metrics */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Desk Quality & Benchmark
            </h3>
            <span className="text-[10px] font-mono text-teal-400">WMO LEVEL 4</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-[#102238] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span>AI Automated Pre-classification</span>
                <span className="font-mono text-teal-400 font-bold">98.2%</span>
              </div>
              <p className="text-[11px] text-slate-400">Matches manual expert taxonomy classification</p>
            </div>

            <div className="p-3 rounded-xl bg-[#102238] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span>False Report Prevention Rate</span>
                <span className="font-mono text-amber-400 font-bold">99.4%</span>
              </div>
              <p className="text-[11px] text-slate-400">Filtered out recycled archival media and clickbait</p>
            </div>

            <div className="p-3 rounded-xl bg-[#102238] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-300">
                <span>Sensor Discrepancy Flagging</span>
                <span className="font-mono text-cyan-400 font-bold">94.1%</span>
              </div>
              <p className="text-[11px] text-slate-400">Detects uncalibrated pressure gauges or thermistors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
