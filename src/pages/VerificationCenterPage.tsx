import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { VerificationStatus } from '../types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  MapPin,
} from 'lucide-react';

export const VerificationCenterPage: React.FC = () => {
  const {
    events,
    verificationSummary,
    setSelectedEvent,
    verifyEvent,
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

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'verified': return 'bg-status-normal/10 text-status-normal border border-status-normal/20';
      case 'pending': return 'bg-status-warning/10 text-status-warning border border-status-warning/20';
      case 'flagged': return 'bg-status-severe/10 text-status-severe border border-status-severe/20';
      case 'rejected': return 'bg-fg-muted/10 text-fg-muted border border-line';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <h2 className="text-2xl font-bold text-fg tracking-tight">Verification Center</h2>
          <p className="text-sm text-fg-muted">Review incoming reports and manage incident validity.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('pending')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'pending' ? 'bg-status-warning/10 border-status-warning shadow-sm' : 'bg-surface border-line hover:border-status-warning/20 hover:bg-status-warning/10'
          }`}
        >
          <div className="flex items-center justify-between text-sm text-fg-muted font-medium mb-2">
            <span>Pending</span>
            <Clock className="w-5 h-5 text-status-warning" />
          </div>
          <div className="text-3xl font-bold text-fg">{verificationSummary.pendingCount}</div>
        </div>

        <div
          onClick={() => setActiveTab('verified')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'verified' ? 'bg-status-normal/10 border-status-normal shadow-sm' : 'bg-surface border-line hover:border-status-normal/20 hover:bg-status-normal/10'
          }`}
        >
          <div className="flex items-center justify-between text-sm text-fg-muted font-medium mb-2">
            <span>Verified</span>
            <CheckCircle2 className="w-5 h-5 text-status-normal" />
          </div>
          <div className="text-3xl font-bold text-fg">{verificationSummary.verifiedCount}</div>
        </div>

        <div
          onClick={() => setActiveTab('flagged')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'flagged' ? 'bg-status-severe/10 border-status-severe shadow-sm' : 'bg-surface border-line hover:border-status-severe/20 hover:bg-status-severe/10'
          }`}
        >
          <div className="flex items-center justify-between text-sm text-fg-muted font-medium mb-2">
            <span>Flagged</span>
            <AlertTriangle className="w-5 h-5 text-status-severe" />
          </div>
          <div className="text-3xl font-bold text-fg">{verificationSummary.flaggedCount}</div>
        </div>

        <div
          onClick={() => setActiveTab('rejected')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'rejected' ? 'bg-fg-muted/10 border-fg-muted shadow-sm' : 'bg-surface border-line hover:border-line hover:bg-fg-muted/5'
          }`}
        >
          <div className="flex items-center justify-between text-sm text-fg-muted font-medium mb-2">
            <span>Rejected</span>
            <XCircle className="w-5 h-5 text-fg-muted" />
          </div>
          <div className="text-3xl font-bold text-fg">{verificationSummary.rejectedCount}</div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-vayu-lavender/30 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-vayu-lavender/30 bg-vayu-lavender/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2 p-1 bg-surface rounded-xl border border-vayu-lavender/20 shadow-sm">
            <button onClick={() => setActiveTab('all')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'all' ? 'bg-fg text-white' : 'text-fg-muted hover:bg-vayu-lavender/20'}`}>All</button>
            <button onClick={() => setActiveTab('pending')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'pending' ? 'bg-status-warning text-white' : 'text-fg-muted hover:bg-status-warning/10 hover:text-status-warning'}`}>Pending</button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-fg-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="w-full bg-surface border border-vayu-lavender/30 rounded-xl pl-9 pr-3 py-2 text-sm text-fg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface text-fg-muted uppercase tracking-wider text-[11px] font-semibold border-b border-line">
              <tr>
                <th className="py-3.5 px-5">Report</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5">Submitted Time</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fg-muted/5">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-vayu-lavender/5 transition-colors">
                  <td className="py-4 px-5 max-w-[200px] truncate">
                    <div className="font-semibold text-fg truncate" title={report.title}>{report.title}</div>
                    <div className="text-[10px] text-fg-muted font-mono mt-1">{report.id}</div>
                  </td>
                  <td className="py-4 px-5 text-fg-muted font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-fg-muted" />
                      {report.location.city}, {report.location.state}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-fg-muted text-xs font-mono">
                    {report.reportedAgo}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedEvent(report)}
                        className="px-3 py-1.5 rounded-lg text-fg bg-app border border-line hover:bg-fg-muted/10 font-bold text-xs transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => verifyEvent(report.id)}
                        disabled={report.status === 'verified'}
                        className="px-3 py-1.5 rounded-lg text-white bg-status-normal hover:bg-status-normal/10 disabled:opacity-50 disabled:bg-fg-muted/20 disabled:text-fg-muted font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verify
                      </button>
                      <button
                        onClick={() => flagEvent(report.id)}
                        disabled={report.status === 'flagged'}
                        className="px-3 py-1.5 rounded-lg text-white bg-status-severe hover:bg-status-severe/10 disabled:opacity-50 disabled:bg-fg-muted/20 disabled:text-fg-muted font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Flag
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-fg-muted text-sm">
                    No reports match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

