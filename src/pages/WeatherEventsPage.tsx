import React, { useState, useMemo } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { WeatherEvent, EventSeverity, VerificationStatus, WeatherCategory } from '../types';
import {
  Search,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wind,
  Droplets,
  CloudLightning,
  Sun,
  CloudFog,
} from 'lucide-react';

export const WeatherEventsPage: React.FC = () => {
  const { events, setSelectedEvent } = useWeatherApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const q = searchTerm.toLowerCase();
      if (
        searchTerm &&
        !e.title.toLowerCase().includes(q) &&
        !e.location.city.toLowerCase().includes(q) &&
        !e.location.state.toLowerCase().includes(q) &&
        !e.id.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
      if (selectedSeverity !== 'all' && e.severity !== selectedSeverity) return false;
      if (selectedStatus !== 'all' && e.status !== selectedStatus) return false;
      return true;
    });
  }, [events, searchTerm, selectedCategory, selectedSeverity, selectedStatus]);

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => {
      const rank = { severe: 3, warning: 2, advisory: 1, normal: 0 };
      return rank[b.severity] - rank[a.severity];
    });
  }, [filteredEvents]);

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage) || 1;
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSeverityBadge = (severity: EventSeverity) => {
    switch (severity) {
      case 'severe': return 'bg-status-severe/10 text-status-severe border border-status-severe/20';
      case 'warning': return 'bg-status-warning/10 text-status-warning border border-status-warning/20';
      case 'advisory': return 'bg-accent/10 text-accent border border-accent/20';
      default: return 'bg-fg-muted/10 text-fg-muted border border-line';
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-fg tracking-tight">Weather Events</h2>
          <p className="text-sm text-fg-muted">Log of all reported and verified incidents.</p>
        </div>
      </div>

      <div className="p-5 bg-surface border border-line rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-fg-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search events..."
              className="w-full bg-app border border-line rounded-xl pl-9 pr-3 py-2 text-sm text-fg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-app border border-line rounded-xl px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Categories</option>
            <option value="cyclone">Cyclone</option>
            <option value="rainfall">Rainfall</option>
            <option value="flooding">Flooding</option>
            <option value="thunderstorm">Thunderstorm</option>
            <option value="heatwave">Heatwave</option>
          </select>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-app border border-line rounded-xl px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Severities</option>
            <option value="severe">Severe</option>
            <option value="warning">Warning</option>
            <option value="advisory">Advisory</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-app border border-line rounded-xl px-3 py-2 text-sm text-fg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-app text-fg-muted uppercase tracking-wider text-[11px] font-semibold border-b border-line">
              <tr>
                <th className="py-3.5 px-4">Event</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Time</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-fg-muted/5">
              {paginatedEvents.map((event) => (
                <tr
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="hover:bg-app transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold text-fg group-hover:text-primary transition-colors">{event.title}</div>
                    <div className="text-xs text-fg-muted mt-0.5 capitalize">{event.category.replace('_', ' ')}</div>
                  </td>
                  <td className="py-4 px-4 text-fg-muted font-medium">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-fg-muted" />
                      {event.location.city}, {event.location.state}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-fg-muted text-xs font-mono">
                    {event.reportedAgo}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getSeverityBadge(event.severity)}`}>
                      {event.severity}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getStatusBadge(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                      }}
                      className="text-accent hover:text-primary font-bold text-xs transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-fg-muted text-sm">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between text-xs font-medium text-fg-muted pt-2">
            <div>Page {currentPage} of {totalPages}</div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-app hover:bg-fg-muted/10 disabled:opacity-50 text-fg transition-colors"
              >
                Prev
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-app hover:bg-fg-muted/10 disabled:opacity-50 text-fg transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

