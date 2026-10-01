import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { IndiaWeatherMap } from '../components/IndiaWeatherMap';
import {
  Search,
  Layers,
  MapPin,
  Clock,
  Droplets,
  CloudLightning,
  Sun,
  Wind,
  CloudFog,
  ArrowRight
} from 'lucide-react';
import { WeatherEvent } from '../types';

export const LiveWeatherMapPage: React.FC = () => {
  const { events, setSelectedEvent } = useWeatherApp();
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeEventPanel, setActiveEventPanel] = useState<WeatherEvent | null>(events[0] || null);

  const categories = [
    { id: 'all', label: 'All', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'rainfall', label: 'Rain', icon: <Droplets className="w-3.5 h-3.5" /> },
    { id: 'flooding', label: 'Flood', icon: <Droplets className="w-3.5 h-3.5" /> },
    { id: 'thunderstorm', label: 'Storm', icon: <CloudLightning className="w-3.5 h-3.5" /> },
    { id: 'heatwave', label: 'Heat', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'cyclone', label: 'Cyclone', icon: <Wind className="w-3.5 h-3.5" /> },
    { id: 'dense_fog', label: 'Fog', icon: <CloudFog className="w-3.5 h-3.5" /> },
  ];

  const filteredList = events.filter((e) => {
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (
      searchLocation &&
      !e.location.city.toLowerCase().includes(searchLocation.toLowerCase()) &&
      !e.location.state.toLowerCase().includes(searchLocation.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 max-w-6xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      {/* Filters (Clean white floating panel style) */}
      <div className="flex flex-wrap items-center gap-4 bg-surface p-3 rounded-2xl border border-line shadow-sm shrink-0">
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-4 h-4 text-fg-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            placeholder="Search location..."
            className="w-full bg-app border border-line rounded-xl pl-9 pr-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-transparent text-fg-muted hover:bg-app hover:text-fg border border-transparent'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Map */}
        <div className="lg:col-span-2 rounded-2xl bg-surface border border-line shadow-sm overflow-hidden flex flex-col relative">
          <IndiaWeatherMap
            compact={false}
            onSelectEvent={(e) => setActiveEventPanel(e)}
          />
        </div>

        {/* Selected Event Details - Dark Navy Compact Panel */}
        <div className="lg:col-span-1 flex flex-col min-h-0">
          {activeEventPanel ? (
            <div className="rounded-2xl bg-fg border border-primary shadow-lg flex flex-col h-full overflow-hidden text-white relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
              
              <div className="p-5 border-b border-primary bg-primary-soft relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    activeEventPanel.severity === 'severe' 
                      ? 'bg-status-severe/10 text-status-severe border-status-severe/20' 
                      : 'bg-status-warning/10 text-status-warning border-status-warning/20'
                  }`}>
                    {activeEventPanel.severity}
                  </span>
                  <span className="text-[10px] font-mono text-fg-muted">{activeEventPanel.id}</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight leading-snug">{activeEventPanel.title}</h3>
                <div className="mt-3 flex items-center gap-1.5 text-sm text-fg-muted font-medium">
                  <MapPin className="w-4 h-4 text-accent" />
                  {activeEventPanel.location.city}, {activeEventPanel.location.state}
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-5 relative z-10">
                <div className="flex items-center gap-2 text-sm text-fg-muted">
                  <Clock className="w-4 h-4 text-status-normal" />
                  <span>{activeEventPanel.timestamp} ({activeEventPanel.reportedAgo})</span>
                </div>
                
                <p className="text-sm text-fg-muted leading-relaxed bg-primary-soft p-4 rounded-xl border border-primary/20">
                  {activeEventPanel.description}
                </p>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Metrics</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {activeEventPanel.telemetry.rainfallMm !== undefined && (
                      <div className="p-3 border border-primary rounded-xl bg-primary-soft text-center">
                        <div className="text-[11px] text-fg-muted mb-1">Rainfall</div>
                        <div className="font-bold text-white">{activeEventPanel.telemetry.rainfallMm} <span className="text-fg-muted text-xs font-normal">mm</span></div>
                      </div>
                    )}
                    {activeEventPanel.telemetry.windSpeedKmh !== undefined && (
                      <div className="p-3 border border-primary rounded-xl bg-primary-soft text-center">
                        <div className="text-[11px] text-fg-muted mb-1">Wind</div>
                        <div className="font-bold text-white">{activeEventPanel.telemetry.windSpeedKmh} <span className="text-fg-muted text-xs font-normal">km/h</span></div>
                      </div>
                    )}
                    {activeEventPanel.telemetry.temperatureC !== undefined && (
                      <div className="p-3 border border-primary rounded-xl bg-primary-soft text-center">
                        <div className="text-[11px] text-fg-muted mb-1">Temp</div>
                        <div className="font-bold text-white">{activeEventPanel.telemetry.temperatureC} <span className="text-fg-muted text-xs font-normal">°C</span></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-primary bg-fg relative z-10">
                <button
                  onClick={() => setSelectedEvent(activeEventPanel)}
                  className="w-full py-2.5 px-4 rounded-xl bg-accent text-fg font-bold text-sm transition-all hover:bg-accent/10 hover:shadow-[0_0_15px_rgba(67,217,230,0.4)] flex items-center justify-center gap-2"
                >
                  View Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-fg border border-primary shadow-lg flex items-center justify-center p-8 text-center h-full">
              <p className="text-sm text-fg-muted">Select an event on the map to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

