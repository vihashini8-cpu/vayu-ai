import React, { useState } from 'react';
import { useWeatherApp } from '../context/WeatherAppContext';
import { IndiaWeatherMap } from '../components/IndiaWeatherMap';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Layers,
  Info,
  Clock,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Wind,
  Droplets,
  CloudLightning,
  Sun,
  CloudFog,
} from 'lucide-react';
import { WeatherCategory, WeatherEvent } from '../types';

export const LiveWeatherMapPage: React.FC = () => {
  const { events, setSelectedEvent } = useWeatherApp();
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeEventPanel, setActiveEventPanel] = useState<WeatherEvent | null>(events[0] || null);

  const categories: { id: string; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Incidents', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'rainfall', label: 'Rainfall', icon: <Droplets className="w-3.5 h-3.5" /> },
    { id: 'flooding', label: 'Flooding', icon: <Droplets className="w-3.5 h-3.5" /> },
    { id: 'thunderstorm', label: 'Thunderstorms', icon: <CloudLightning className="w-3.5 h-3.5" /> },
    { id: 'heatwave', label: 'Heatwaves', icon: <Sun className="w-3.5 h-3.5" /> },
    { id: 'cyclone', label: 'Cyclones & Gale', icon: <Wind className="w-3.5 h-3.5" /> },
    { id: 'dense_fog', label: 'Dense Fog', icon: <CloudFog className="w-3.5 h-3.5" /> },
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
    <div className="space-y-4">
      {/* Header & Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-[#0B1929] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Location Search */}
        <div className="flex items-center gap-3 flex-1 min-w-[240px] max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search Indian city, district, or state (e.g. Mumbai, Puri, Assam)..."
              className="w-full bg-[#102238] border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
            {searchLocation && (
              <button
                onClick={() => setSearchLocation('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-[#102238] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Active Count & Demo Tag */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="text-cyan-400 font-semibold">{filteredList.length}</span> events active
        </div>
      </div>

      {/* Main Map & Interactive Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Large Format Interactive Map */}
        <div className="lg:col-span-8 xl:col-span-9">
          <IndiaWeatherMap
            compact={false}
            onSelectEvent={(e) => {
              setActiveEventPanel(e);
            }}
          />
        </div>

        {/* Selected Event Information Panel */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col space-y-4">
          {activeEventPanel ? (
            <div className="p-5 rounded-2xl bg-[#0B1929] border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-cyan-400 font-bold">{activeEventPanel.id}</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      activeEventPanel.severity === 'severe'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {activeEventPanel.severity}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-snug">
                  {activeEventPanel.title}
                </h3>

                <div className="mt-2 text-xs text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-semibold">{activeEventPanel.location.city}</span>, {activeEventPanel.location.state}
                </div>

                <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{activeEventPanel.timestamp} ({activeEventPanel.reportedAgo})</span>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-[#102238] border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {activeEventPanel.description}
                </div>

                {/* Telemetry Snapshot */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Surface Telemetry
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {activeEventPanel.telemetry.rainfallMm !== undefined && (
                      <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">Precipitation</span>
                        <span className="font-mono font-bold text-white">{activeEventPanel.telemetry.rainfallMm} mm</span>
                      </div>
                    )}
                    {activeEventPanel.telemetry.windSpeedKmh !== undefined && (
                      <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">Wind Velocity</span>
                        <span className="font-mono font-bold text-teal-400">{activeEventPanel.telemetry.windSpeedKmh} km/h</span>
                      </div>
                    )}
                    {activeEventPanel.telemetry.temperatureC !== undefined && (
                      <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">Ambient Temp</span>
                        <span className="font-mono font-bold text-amber-400">{activeEventPanel.telemetry.temperatureC} °C</span>
                      </div>
                    )}
                    {activeEventPanel.telemetry.pressureHpa !== undefined && (
                      <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
                        <span className="text-slate-500 block text-[10px]">Barometer</span>
                        <span className="font-mono font-bold text-purple-400">{activeEventPanel.telemetry.pressureHpa} hPa</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Provenance */}
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Source: {activeEventPanel.source.name}</span>
                    <span className="font-mono text-teal-400 font-semibold">{activeEventPanel.source.trustScore}/100</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => setSelectedEvent(activeEventPanel)}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow-md shadow-cyan-950/40 text-center"
              >
                Inspect Telemetry & Verification Drawer
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#0B1929] border border-slate-800 text-center text-xs text-slate-500">
              Click any weather pin on the India map to examine localized observations.
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-xl bg-[#0B1929] border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>Map Navigation Guidance</span>
            </div>
            <p className="leading-relaxed">
              Use mouse wheel to zoom into specific states. Switch between Doppler Radar, Wind Vectors, and Thermal Infrared layers via top-right controls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
