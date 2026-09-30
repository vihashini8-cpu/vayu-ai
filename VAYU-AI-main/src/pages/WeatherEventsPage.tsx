import React, { useState, useMemo } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { WeatherEvent, EventSeverity, VerificationStatus, WeatherCategory } from '../types';
import {
  Search,
  LayoutGrid,
  List,
  Filter,
  ArrowUpDown,
  MapPin,
  Clock,
  Radio,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wind,
  Droplets,
  CloudLightning,
  Sun,
  CloudFog,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const WeatherEventsPage: React.FC = () => {
  const { events, setSelectedEvent } = useWeatherApp();

  const [layoutMode, setLayoutMode] = useState<'cards' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'severity' | 'city'>('time');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique states
  const statesList = useMemo(() => {
    const set = new Set(events.map((e) => e.location.state));
    return Array.from(set);
  }, [events]);

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
      if (selectedState !== 'all' && e.location.state !== selectedState) return false;
      if (selectedSeverity !== 'all' && e.severity !== selectedSeverity) return false;
      if (selectedStatus !== 'all' && e.status !== selectedStatus) return false;
      return true;
    });
  }, [events, searchTerm, selectedCategory, selectedState, selectedSeverity, selectedStatus]);

  const sortedEvents = useMemo(() => {
    const list = [...filteredEvents];
    if (sortBy === 'severity') {
      const rank = { severe: 3, warning: 2, advisory: 1, normal: 0 };
      list.sort((a, b) => rank[b.severity] - rank[a.severity]);
    } else if (sortBy === 'city') {
      list.sort((a, b) => a.location.city.localeCompare(b.location.city));
    }
    return list;
  }, [filteredEvents, sortBy]);

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage) || 1;
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSeverityBadge = (severity: EventSeverity) => {
    switch (severity) {
      case 'severe':
        return 'text-rose-300 bg-rose-500/10 border-rose-500/30';
      case 'warning':
        return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
      case 'advisory':
        return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30';
      default:
        return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  const getStatusBadge = (status: VerificationStatus) => {
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

  const getCategoryIcon = (category: WeatherCategory) => {
    switch (category) {
      case 'cyclone':
      case 'strong_winds':
        return <Wind className="w-4 h-4 text-teal-400" />;
      case 'flooding':
      case 'rainfall':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'thunderstorm':
        return <CloudLightning className="w-4 h-4 text-purple-400" />;
      case 'heatwave':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'dense_fog':
      case 'dust_storm':
        return <CloudFog className="w-4 h-4 text-slate-400" />;
      default:
        return <MapPin className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-tight">
            Weather Events Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Unified chronological record of national meteorological anomalies and verified incidents
          </p>
        </div>

        {/* Layout Mode Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0B1929] border border-slate-800">
          <button
            onClick={() => setLayoutMode('table')}
            className={`p-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              layoutMode === 'table'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Data Table View"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setLayoutMode('cards')}
            className={`p-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              layoutMode === 'cards'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Cards</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 rounded-2xl bg-[#0B1929] border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city, title, event ID..."
              className="w-full bg-[#102238] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#102238] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              <option value="cyclone">Cyclone</option>
              <option value="rainfall">Heavy Rainfall</option>
              <option value="flooding">Flooding</option>
              <option value="thunderstorm">Thunderstorm</option>
              <option value="heatwave">Heatwave</option>
              <option value="dense_fog">Dense Fog</option>
              <option value="dust_storm">Dust Storm</option>
              <option value="strong_winds">Strong Winds</option>
            </select>
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-[#102238] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All States & UTs</option>
              {statesList.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full bg-[#102238] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Severities</option>
              <option value="severe">Severe Threats</option>
              <option value="warning">Warnings</option>
              <option value="advisory">Advisories</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#102238] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="time">Sort by Recent</option>
              <option value="severity">Sort by Threat Severity</option>
              <option value="city">Sort by City Name</option>
            </select>
          </div>
        </div>

        {/* Filter Summary Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div>
            Showing <span className="font-semibold text-white">{filteredEvents.length}</span> matching incidents
          </div>
          {(searchTerm || selectedCategory !== 'all' || selectedState !== 'all' || selectedSeverity !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedState('all');
                setSelectedSeverity('all');
                setSelectedStatus('all');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Content Rendering based on Layout */}
      {paginatedEvents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0B1929] border border-slate-800 text-slate-400 space-y-3">
          <p className="text-sm">No weather events match your filter criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedState('all');
              setSelectedSeverity('all');
            }}
            className="px-4 py-2 bg-slate-800 text-xs rounded-lg text-cyan-400 hover:text-white"
          >
            Clear Filters
          </button>
        </div>
      ) : layoutMode === 'table' ? (
        /* Data Table View */
        <div className="rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#07111F] border-b border-slate-800 text-slate-400 uppercase font-semibold tracking-wider text-[11px]">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Incident Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Observed Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {paginatedEvents.map((event) => (
                  <tr
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="hover:bg-[#102238]/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-cyan-400 whitespace-nowrap">
                      {event.id}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200 group-hover:text-white max-w-xs truncate">
                      {event.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <span className="font-semibold text-white">{event.location.city}</span>, {event.location.state}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-300 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        {getCategoryIcon(event.category)}
                        <span>{event.category.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getSeverityBadge(
                          event.severity
                        )}`}
                      >
                        {event.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {event.reportedAgo}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-medium capitalize px-2 py-0.5 rounded border ${getStatusBadge(
                          event.status
                        )}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                        }}
                        className="px-2.5 py-1 rounded bg-[#102238] hover:bg-slate-700 text-cyan-300 hover:text-white transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="p-4 rounded-2xl bg-[#0B1929] border border-slate-800 hover:border-cyan-500/40 shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-cyan-400 font-semibold">{event.id}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getSeverityBadge(
                      event.severity
                    )}`}
                  >
                    {event.severity}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2 text-slate-300 text-xs font-semibold capitalize">
                  {getCategoryIcon(event.category)}
                  <span>{event.category.replace('_', ' ')}</span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 line-clamp-2 leading-snug">
                  {event.title}
                </h3>

                <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    {event.location.city}, {event.location.state}
                  </span>
                  <span className="font-mono text-slate-500">{event.reportedAgo}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span
                  className={`text-[10px] font-medium capitalize px-2 py-0.5 rounded border ${getStatusBadge(
                    event.status
                  )}`}
                >
                  {event.status}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                  }}
                  className="text-xs text-cyan-400 group-hover:text-cyan-300 font-semibold"
                >
                  Inspect →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 px-1 text-xs text-slate-400">
          <div>
            Page <span className="text-white font-semibold">{currentPage}</span> of{' '}
            <span className="text-white font-semibold">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-[#0B1929] border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-[#0B1929] border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
