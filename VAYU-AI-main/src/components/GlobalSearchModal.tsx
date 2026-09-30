import React, { useState, useEffect, useRef } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { Search, X, MapPin, Radio, Zap, ArrowRight, ShieldAlert } from 'lucide-react';
import { ActiveView, WeatherEvent } from '../types';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    events,
    dataSources,
    setSelectedEvent,
    setActiveView,
  } = useWeatherApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  // Keyboard shortcut Ctrl/Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const filteredEvents = events.filter((e) => {
    const q = query.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.location.city.toLowerCase().includes(q) ||
      e.location.state.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q)
    );
  });

  const filteredSources = dataSources.filter((s) => {
    const q = query.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.organization.toLowerCase().includes(q);
  });

  const handleSelectEvent = (event: WeatherEvent) => {
    setSelectedEvent(event);
    setIsSearchModalOpen(false);
  };

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    setIsSearchModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-start justify-center pt-16 sm:pt-24 px-4 transition-all">
      <div className="w-full max-w-2xl bg-[#0B1929] border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#07111F]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search weather events, cities (e.g. Mumbai, Puri), states, data streams..."
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="ml-2 text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Navigation Links */}
        <div className="px-4 py-2 bg-[#091524] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 shrink-0">Quick Jump:</span>
          <button
            onClick={() => handleNavigate('live_map')}
            className="px-2.5 py-1 rounded bg-[#102238] hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Live India Map
          </button>
          <button
            onClick={() => handleNavigate('verification')}
            className="px-2.5 py-1 rounded bg-[#102238] hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Verification Center
          </button>
          <button
            onClick={() => handleNavigate('citizen_report')}
            className="px-2.5 py-1 rounded bg-[#102238] hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Submit Incident
          </button>
          <button
            onClick={() => handleNavigate('analytics')}
            className="px-2.5 py-1 rounded bg-[#102238] hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            Analytics
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Weather Events */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Weather Incidents ({filteredEvents.length})</span>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching events found for &quot;{query}&quot;
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredEvents.slice(0, 6).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleSelectEvent(event)}
                    className="w-full text-left p-3 rounded-xl bg-[#102238]/60 hover:bg-[#102238] border border-slate-800/80 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[11px] text-cyan-400">{event.id}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs text-slate-400 capitalize">{event.category}</span>
                        {event.severity === 'severe' && (
                          <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/30">
                            Severe
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{event.location.city}, {event.location.state}</span>
                        <span>·</span>
                        <span>{event.reportedAgo}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 transition-transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Data Sources */}
          {filteredSources.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Monitored Meteorological Sources
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredSources.slice(0, 4).map((source) => (
                  <button
                    key={source.id}
                    onClick={() => handleNavigate('sources')}
                    className="p-2.5 rounded-lg bg-[#102238]/40 hover:bg-[#102238] border border-slate-800 text-left transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300">
                        {source.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {source.organization}
                      </div>
                    </div>
                    <Radio className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#07111F] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">ESC</kbd> to close</span>
            <span>·</span>
            <span>Use Arrow Keys to navigate</span>
          </div>
          <div className="text-cyan-400 font-mono text-[10px]">VAYU AI Unified Engine</div>
        </div>
      </div>
    </div>
  );
};
