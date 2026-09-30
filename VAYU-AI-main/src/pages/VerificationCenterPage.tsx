import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { VerificationStatus, WeatherEvent } from '../types';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Cpu,
  MapPin,
  Radio,
  FileCheck2,
  Info,
} from 'lucide-react';

export const VerificationCenterPage: React.FC = () => {
  const {
    events,
    verificationSummary,
    selectedEvent,
    setSelectedEvent,
    verifyEvent,
    rejectEvent,
    flagEvent,
  } = useWeatherApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'flagged' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = events.filter((e) => {
    if (activeTab !== 'all' && e.status !== activeTab) return false;
    if (
      searchQuery &&
      !e.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !e.location.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !e.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getStatusColor = (status: VerificationStatus) => {
    switch (status) {
      case 'verified':
        return 'text-teal-300 bg-teal-500/10 border-teal-500/30';
      case 'pending':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
      case 'flagged':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'rejected':
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
            Weather Report Verification Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Operational review queue: Inspect citizen and sensor reports, review AI pre-classifications, and publish verified events
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-[#0B1929] border border-slate-800 text-xs font-mono text-cyan-300">
          DEMO REVIEW INTERFACE
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-xl bg-[#0B1929] border transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'border-amber-500 shadow-md shadow-amber-950/40 bg-[#102238]'
              : 'border-slate-800 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {verificationSummary.pendingCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Requires reviewer action</div>
        </div>

        <div
          onClick={() => setActiveTab('verified')}
          className={`p-4 rounded-xl bg-[#0B1929] border transition-all cursor-pointer ${
            activeTab === 'verified'
              ? 'border-teal-500 shadow-md shadow-teal-950/40 bg-[#102238]'
              : 'border-slate-800 hover:border-teal-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Verified Incidents</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-400 tabular-nums">
            {verificationSummary.verifiedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Published to National Feed</div>
        </div>

        <div
          onClick={() => setActiveTab('flagged')}
          className={`p-4 rounded-xl bg-[#0B1929] border transition-all cursor-pointer ${
            activeTab === 'flagged'
              ? 'border-rose-500 shadow-md shadow-rose-950/40 bg-[#102238]'
              : 'border-slate-800 hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Flagged for SDMA</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
            {verificationSummary.flaggedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Discrepancy noted</div>
        </div>

        <div
          onClick={() => setActiveTab('rejected')}
          className={`p-4 rounded-xl bg-[#0B1929] border transition-all cursor-pointer ${
            activeTab === 'rejected'
              ? 'border-slate-600 shadow-md bg-[#102238]'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Rejected Reports</span>
            <XCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-400 tabular-nums">
            {verificationSummary.rejectedCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Invalid or duplicate</div>
        </div>
      </div>

      {/* AI Transparency Notice */}
      <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <div className="leading-relaxed">
          <strong className="text-white font-semibold">Verification Workflow:</strong> In this operational prototype, AI classifications and confidence scores provide preliminary decision support for duty officers. Verified reports immediately reflect across the Live Map, Events Ledger, and Command Center dashboard.
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="p-4 rounded-2xl bg-[#0B1929] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'pending'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Review ({verificationSummary.pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Reports ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('verified')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'verified'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Verified ({verificationSummary.verifiedCount})
          </button>
          <button
            onClick={() => setActiveTab('flagged')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'flagged'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Flagged ({verificationSummary.flaggedCount})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'rejected'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rejected ({verificationSummary.rejectedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report ID, city, or event..."
            className="w-full bg-[#102238] border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Review Queue Cards */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0B1929] border border-slate-800 text-slate-400">
            No incident reports found for the selected filter.
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="p-5 rounded-2xl bg-[#0B1929] border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              {/* Left Details */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono text-cyan-400 font-bold">{report.id}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 capitalize">{report.category.replace('_', ' ')}</span>
                  <span className="text-slate-600">·</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                      report.severity === 'severe'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {report.severity}
                  </span>
                  <span
                    className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded border ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {report.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {report.location.city}, {report.location.state}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Radio className="w-3.5 h-3.5 text-blue-400" />
                    {report.source.name}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-slate-500">{report.reportedAgo}</span>
                </div>

                {/* AI Preliminary Insight Banner */}
                {report.aiAnalysis && (
                  <div className="mt-2.5 p-3 rounded-xl bg-[#102238] border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-slate-300">
                        <strong className="text-cyan-300 font-medium">Preliminary AI Support:</strong> {report.aiAnalysis.summary}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-[11px]">
                      <span className="text-slate-400 font-mono">
                        Confidence: <strong className="text-cyan-300">{report.aiAnalysis.confidenceScore}%</strong>
                      </span>
                      <span className="text-slate-400">
                        Duplicate Risk:{' '}
                        <strong
                          className={
                            report.aiAnalysis.duplicateRisk === 'low'
                              ? 'text-teal-400'
                              : 'text-amber-400'
                          }
                        >
                          {report.aiAnalysis.duplicateRisk.toUpperCase()}
                        </strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Review Controls */}
              <div className="flex flex-row lg:flex-col gap-2 shrink-0 justify-end pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-5">
                <button
                  onClick={() => setSelectedEvent(report)}
                  className="px-3.5 py-2 rounded-lg bg-[#102238] hover:bg-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors text-center whitespace-nowrap"
                >
                  View Details & Dossier
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => verifyEvent(report.id)}
                    disabled={report.status === 'verified'}
                    className="flex-1 px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>

                  <button
                    onClick={() => flagEvent(report.id, 'Flagged for field verification by district SDMA')}
                    disabled={report.status === 'flagged'}
                    className="flex-1 px-3 py-2 rounded-lg bg-amber-600/90 hover:bg-amber-500 disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Flag</span>
                  </button>

                  <button
                    onClick={() => rejectEvent(report.id, 'Disconfirmed upon secondary inspection')}
                    disabled={report.status === 'rejected'}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 border border-slate-700 hover:border-rose-700/60 disabled:opacity-40 text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
