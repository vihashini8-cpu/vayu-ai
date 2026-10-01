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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-fg/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 transition-all">
      <div className="w-full max-w-2xl bg-surface border border-line rounded-2xl shadow-2xl shadow-fg/5 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-4 border-b border-line bg-app">
          <Search className="w-5 h-5 text-primary shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search weather events, cities (e.g. Mumbai, Puri), states, data streams..."
            className="w-full bg-transparent text-sm font-bold text-fg placeholder:text-fg-muted focus:outline-none placeholder:font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-fg-muted hover:text-fg p-1 text-xs font-bold"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="ml-2 text-fg-muted hover:text-status-severe hover:bg-status-severe/10 p-1.5 rounded-lg transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Navigation Links */}
        <div className="px-5 py-2.5 bg-surface border-b border-line flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider shrink-0">Quick Jump:</span>
          <button
            onClick={() => handleNavigate('live_map')}
            className="px-2.5 py-1.5 rounded-lg bg-app hover:bg-vayu-lavender/30 hover:text-primary text-fg-muted font-bold transition-colors shrink-0 border border-line"
          >
            Live India Map
          </button>
          <button
            onClick={() => handleNavigate('verification')}
            className="px-2.5 py-1.5 rounded-lg bg-app hover:bg-status-normal/10 hover:text-status-normal text-fg-muted font-bold transition-colors shrink-0 border border-line"
          >
            Verification Center
          </button>
          <button
            onClick={() => handleNavigate('citizen_report')}
            className="px-2.5 py-1.5 rounded-lg bg-app hover:bg-primary-soft hover:text-primary text-fg-muted font-bold transition-colors shrink-0 border border-line"
          >
            Submit Incident
          </button>
          <button
            onClick={() => handleNavigate('analytics')}
            className="px-2.5 py-1.5 rounded-lg bg-app hover:bg-accent/10 hover:text-accent text-fg-muted font-bold transition-colors shrink-0 border border-line"
          >
            Analytics
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-app">
          {/* Weather Events */}
          <div>
            <div className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-3 flex items-center justify-between px-1">
              <span>Weather Incidents ({filteredEvents.length})</span>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="p-6 text-center text-sm font-medium text-fg-muted bg-surface rounded-xl border border-line">
                No matching events found for &quot;{query}&quot;
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEvents.slice(0, 6).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => handleSelectEvent(event)}
                    className="w-full text-left p-3.5 rounded-xl bg-surface hover:bg-accent/10 border border-line hover:border-accent/20 shadow-sm transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-[10px] font-bold text-primary">{event.id}</span>
                        <span className="text-fg-muted">·</span>
                        <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider">{event.category}</span>
                        {event.severity === 'severe' && (
                          <span className="text-[9px] uppercase font-bold text-status-severe bg-status-severe/10 px-1.5 py-0.5 rounded border border-status-severe/20">
                            Severe
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-fg group-hover:text-primary truncate transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] font-semibold text-fg-muted uppercase tracking-wider">
                        <MapPin className="w-3 h-3 text-accent" />
                        <span>{event.location.city}, {event.location.state}</span>
                        <span className="text-fg-muted">·</span>
                        <span className="normal-case tracking-normal">{event.reportedAgo}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-fg-muted group-hover:text-primary shrink-0 transition-all group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Data Sources */}
          {filteredSources.length > 0 && (
            <div className="pt-2">
              <div className="text-[10px] font-bold text-fg-muted uppercase tracking-wider mb-3 px-1">
                Monitored Meteorological Sources
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredSources.slice(0, 4).map((source) => (
                  <button
                    key={source.id}
                    onClick={() => handleNavigate('sources')}
                    className="p-3 rounded-xl bg-surface hover:bg-status-normal/10 border border-line hover:border-status-normal/20 shadow-sm text-left transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-fg truncate group-hover:text-status-normal transition-colors">
                        {source.name}
                      </div>
                      <div className="text-[10px] font-bold text-fg-muted uppercase tracking-wider truncate mt-1">
                        {source.organization}
                      </div>
                    </div>
                    <Radio className="w-4 h-4 text-fg-muted group-hover:text-status-normal shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-app border-t border-line flex items-center justify-between text-[10px] font-bold text-fg-muted uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span>Press <kbd className="px-1.5 py-1 rounded-md bg-surface border border-line text-fg font-mono shadow-sm">ESC</kbd> to close</span>
            <span className="text-fg-muted">·</span>
            <span>Use Arrow Keys to navigate</span>
          </div>
          <div className="text-primary font-mono">VAYU AI Unified Engine</div>
        </div>
      </div>
    </div>
  );
};
